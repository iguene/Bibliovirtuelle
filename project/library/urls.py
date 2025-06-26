from django.urls import path
from . import views

urlpatterns = [
    # Authors
    path('authors/', views.AuthorListCreateView.as_view(), name='author-list-create'),
    path('authors/<int:pk>/', views.AuthorDetailView.as_view(), name='author-detail'),
    
    # Categories
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    
    # Publishers
    path('publishers/', views.PublisherListCreateView.as_view(), name='publisher-list-create'),
    path('publishers/<int:pk>/', views.PublisherDetailView.as_view(), name='publisher-detail'),
    
    # Books
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('books/create/', views.BookCreateView.as_view(), name='book-create'),
    path('books/<int:pk>/update/', views.BookUpdateView.as_view(), name='book-update'),
    path('books/<int:pk>/delete/', views.BookDeleteView.as_view(), name='book-delete'),
    
    # Loans
    path('loans/', views.LoanListView.as_view(), name='loan-list'),
    path('loans/create/', views.LoanCreateView.as_view(), name='loan-create'),
    path('loans/<int:loan_id>/return/', views.return_book, name='loan-return'),
    
    # Reservations
    path('reservations/', views.ReservationListView.as_view(), name='reservation-list'),
    path('reservations/create/', views.ReservationCreateView.as_view(), name='reservation-create'),
    
    # Reviews
    path('reviews/', views.ReviewListCreateView.as_view(), name='review-list-create'),
    
    # Statistics
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
]