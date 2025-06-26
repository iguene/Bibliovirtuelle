from rest_framework import serializers
from .models import Author, Category, Publisher, Book, Loan, Reservation, Review
from accounts.serializers import UserSerializer

class AuthorSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Author
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'

class BookListSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    publisher = PublisherSerializer(read_only=True)
    authors_list = serializers.ReadOnlyField()
    categories_list = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'subtitle', 'isbn', 'description', 'publish_date',
            'pages', 'language', 'cover_image', 'status', 'quantity', 'available_quantity',
            'authors', 'categories', 'publisher', 'authors_list', 'categories_list',
            'is_available', 'created_at', 'updated_at'
        ]

class BookDetailSerializer(BookListSerializer):
    reviews = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    
    class Meta(BookListSerializer.Meta):
        fields = BookListSerializer.Meta.fields + ['reviews', 'average_rating', 'total_reviews']
    
    def get_reviews(self, obj):
        reviews = obj.reviews.all()[:5]  # Derniers 5 avis
        return ReviewSerializer(reviews, many=True).data
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0
    
    def get_total_reviews(self, obj):
        return obj.reviews.count()

class BookCreateUpdateSerializer(serializers.ModelSerializer):
    authors = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all(), many=True)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    
    class Meta:
        model = Book
        fields = [
            'title', 'subtitle', 'isbn', 'description', 'publish_date',
            'pages', 'language', 'cover_image', 'status', 'quantity', 'available_quantity',
            'authors', 'categories', 'publisher'
        ]
    
    def create(self, validated_data):
        authors = validated_data.pop('authors')
        categories = validated_data.pop('categories')
        
        book = Book.objects.create(**validated_data)
        book.authors.set(authors)
        book.categories.set(categories)
        
        return book
    
    def update(self, instance, validated_data):
        authors = validated_data.pop('authors', None)
        categories = validated_data.pop('categories', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if authors is not None:
            instance.authors.set(authors)
        if categories is not None:
            instance.categories.set(categories)
        
        return instance

class LoanSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    book_id = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    is_overdue = serializers.ReadOnlyField()
    days_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Loan
        fields = '__all__'
    
    def create(self, validated_data):
        if 'user_id' not in validated_data:
            validated_data['user_id'] = self.context['request'].user.id
        return super().create(validated_data)

class ReservationSerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    book_id = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = Reservation
        fields = '__all__'
    
    def create(self, validated_data):
        if 'user_id' not in validated_data:
            validated_data['user_id'] = self.context['request'].user.id
        return super().create(validated_data)

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)