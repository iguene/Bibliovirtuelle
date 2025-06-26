import django_filters
from .models import Book, Category, Author

class BookFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    authors = django_filters.ModelMultipleChoiceFilter(queryset=Author.objects.all())
    categories = django_filters.ModelMultipleChoiceFilter(queryset=Category.objects.all())
    publish_year = django_filters.NumberFilter(field_name='publish_date', lookup_expr='year')
    publish_year_gte = django_filters.NumberFilter(field_name='publish_date', lookup_expr='year__gte')
    publish_year_lte = django_filters.NumberFilter(field_name='publish_date', lookup_expr='year__lte')
    pages_gte = django_filters.NumberFilter(field_name='pages', lookup_expr='gte')
    pages_lte = django_filters.NumberFilter(field_name='pages', lookup_expr='lte')
    
    class Meta:
        model = Book
        fields = ['status', 'language', 'publisher']