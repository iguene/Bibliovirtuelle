from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, Count, Avg
from datetime import date, timedelta
from .models import Author, Category, Publisher, Book, Loan, Reservation, Review
from .serializers import (
    AuthorSerializer, CategorySerializer, PublisherSerializer,
    BookListSerializer, BookDetailSerializer, BookCreateUpdateSerializer,
    LoanSerializer, ReservationSerializer, ReviewSerializer
)
from .filters import BookFilter

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_admin

# Author Views
class AuthorListCreateView(generics.ListCreateAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'nationality']
    ordering_fields = ['last_name', 'first_name', 'birth_date']
    ordering = ['last_name', 'first_name']

class AuthorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminOrReadOnly]

# Category Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

# Publisher Views
class PublisherListCreateView(generics.ListCreateAPIView):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [IsAdminOrReadOnly]

class PublisherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [IsAdminOrReadOnly]

# Book Views
class BookListView(generics.ListAPIView):
    queryset = Book.objects.all().prefetch_related('authors', 'categories').select_related('publisher')
    serializer_class = BookListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BookFilter
    search_fields = ['title', 'subtitle', 'isbn', 'authors__first_name', 'authors__last_name']
    ordering_fields = ['title', 'publish_date', 'pages', 'created_at']
    ordering = ['title']

class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all().prefetch_related('authors', 'categories', 'reviews__user').select_related('publisher')
    serializer_class = BookDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookCreateView(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BookUpdateView(generics.UpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookCreateUpdateSerializer
    permission_classes = [IsAdminOrReadOnly]

class BookDeleteView(generics.DestroyAPIView):
    queryset = Book.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.user.is_admin:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

# Loan Views
class LoanListView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'book', 'user']
    ordering_fields = ['borrow_date', 'due_date']
    ordering = ['-borrow_date']
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return Loan.objects.all().select_related('book', 'user')
        return Loan.objects.filter(user=self.request.user).select_related('book', 'user')

class LoanCreateView(generics.CreateAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        book = Book.objects.get(id=serializer.validated_data['book_id'])
        if not book.is_available:
            raise serializers.ValidationError("Ce livre n'est pas disponible.")
        
        # Réduire la quantité disponible
        book.available_quantity -= 1
        if book.available_quantity == 0:
            book.status = 'borrowed'
        book.save()
        
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def return_book(request, loan_id):
    try:
        loan = Loan.objects.get(id=loan_id)
        if loan.user != request.user and not request.user.is_admin:
            return Response({'error': 'Permission refusée'}, status=status.HTTP_403_FORBIDDEN)
        
        loan.status = 'returned'
        loan.return_date = date.today()
        loan.save()
        
        # Augmenter la quantité disponible
        book = loan.book
        book.available_quantity += 1
        if book.status == 'borrowed' and book.available_quantity > 0:
            book.status = 'available'
        book.save()
        
        return Response({'message': 'Livre retourné avec succès'})
    except Loan.DoesNotExist:
        return Response({'error': 'Emprunt non trouvé'}, status=status.HTTP_404_NOT_FOUND)

# Reservation Views
class ReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return Reservation.objects.all().select_related('book', 'user')
        return Reservation.objects.filter(user=self.request.user).select_related('book', 'user')

class ReservationCreateView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        from django.utils import timezone
        expiry_date = timezone.now() + timedelta(days=7)
        serializer.save(user=self.request.user, expiry_date=expiry_date)

# Review Views
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        book_id = self.request.query_params.get('book_id')
        if book_id:
            return Review.objects.filter(book_id=book_id).select_related('user', 'book')
        return Review.objects.all().select_related('user', 'book')

# Statistics Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    if not request.user.is_admin:
        # Stats utilisateur
        user_loans = Loan.objects.filter(user=request.user)
        active_loans = user_loans.filter(status='active').count()
        overdue_loans = user_loans.filter(status='overdue').count()
        total_borrowed = user_loans.count()
        
        return Response({
            'active_loans': active_loans,
            'overdue_loans': overdue_loans,
            'total_borrowed': total_borrowed,
        })
    
    # Stats admin
    from accounts.models import User
    total_books = Book.objects.count()
    available_books = Book.objects.filter(status='available').count()
    borrowed_books = Book.objects.filter(status='borrowed').count()
    total_users = User.objects.count()
    active_loans = Loan.objects.filter(status='active').count()
    overdue_loans = Loan.objects.filter(status='overdue').count()
    
    # Top genres
    top_categories = Category.objects.annotate(
        book_count=Count('books')
    ).order_by('-book_count')[:5]
    
    # Livres récents
    recent_books = Book.objects.order_by('-created_at')[:5]
    
    return Response({
        'total_books': total_books,
        'available_books': available_books,
        'borrowed_books': borrowed_books,
        'total_users': total_users,
        'active_loans': active_loans,
        'overdue_loans': overdue_loans,
        'top_categories': CategorySerializer(top_categories, many=True).data,
        'recent_books': BookListSerializer(recent_books, many=True).data,
    })