from django.contrib import admin
from .models import Author, Category, Publisher, Book, Loan, Reservation, Review

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'nationality', 'birth_date', 'age')
    list_filter = ('nationality', 'birth_date')
    search_fields = ('first_name', 'last_name', 'nationality')
    ordering = ('last_name', 'first_name')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')
    search_fields = ('name',)

@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'website')
    search_fields = ('name',)

class BookAuthorInline(admin.TabularInline):
    model = Book.authors.through
    extra = 1

class BookCategoryInline(admin.TabularInline):
    model = Book.categories.through
    extra = 1

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'authors_list', 'publisher', 'status', 'available_quantity', 'publish_date')
    list_filter = ('status', 'language', 'categories', 'publish_date')
    search_fields = ('title', 'isbn', 'authors__first_name', 'authors__last_name')
    filter_horizontal = ('authors', 'categories')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('title', 'subtitle', 'isbn', 'description')
        }),
        ('Publication', {
            'fields': ('publisher', 'publish_date', 'pages', 'language')
        }),
        ('Relations', {
            'fields': ('authors', 'categories')
        }),
        ('Gestion', {
            'fields': ('status', 'quantity', 'available_quantity', 'cover_image')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'borrow_date', 'due_date', 'status', 'is_overdue')
    list_filter = ('status', 'borrow_date', 'due_date')
    search_fields = ('book__title', 'user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'is_overdue', 'days_overdue')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('book', 'user')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'reservation_date', 'expiry_date', 'status', 'notified')
    list_filter = ('status', 'reservation_date', 'notified')
    search_fields = ('book__title', 'user__first_name', 'user__last_name')
    readonly_fields = ('is_expired',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('book__title', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')