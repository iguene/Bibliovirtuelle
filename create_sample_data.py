#!/usr/bin/env python
import os
import sys
import django
from datetime import date, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_project.settings')
django.setup()

from accounts.models import User
from library.models import Author, Category, Publisher, Book, Loan
from django.contrib.auth.hashers import make_password

def create_sample_data():
    print("Creating sample data...")
    
    # Create admin user
    admin_user, created = User.objects.get_or_create(
        email='admin@library.com',
        defaults={
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'password': make_password('password'),
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        print("✓ Admin user created")
    
    # Create regular user
    regular_user, created = User.objects.get_or_create(
        email='john.doe@email.com',
        defaults={
            'username': 'john.doe',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'user',
            'password': make_password('password')
        }
    )
    if created:
        print("✓ Regular user created")
    
    # Create another user
    jane_user, created = User.objects.get_or_create(
        email='jane.smith@email.com',
        defaults={
            'username': 'jane.smith',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'role': 'user',
            'password': make_password('password')
        }
    )
    if created:
        print("✓ Jane user created")
    
    # Create categories
    categories_data = [
        {'name': 'Fiction', 'description': 'Œuvres de fiction', 'color': '#3B82F6'},
        {'name': 'Science-Fiction', 'description': 'Science-fiction et fantasy', 'color': '#8B5CF6'},
        {'name': 'Romance', 'description': 'Romans d\'amour', 'color': '#EC4899'},
        {'name': 'Thriller', 'description': 'Suspense et thriller', 'color': '#EF4444'},
        {'name': 'Classique', 'description': 'Littérature classique', 'color': '#F59E0B'},
    ]
    
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"✓ Category '{cat_data['name']}' created")
    
    # Create publishers
    publishers_data = [
        {'name': 'Gallimard', 'email': 'contact@gallimard.fr', 'website': 'https://www.gallimard.fr'},
        {'name': 'Hachette', 'email': 'contact@hachette.fr', 'website': 'https://www.hachette.fr'},
        {'name': 'Penguin Random House', 'email': 'contact@penguinrandomhouse.com', 'website': 'https://www.penguinrandomhouse.com'},
    ]
    
    for pub_data in publishers_data:
        publisher, created = Publisher.objects.get_or_create(
            name=pub_data['name'],
            defaults=pub_data
        )
        if created:
            print(f"✓ Publisher '{pub_data['name']}' created")
    
    # Create authors
    authors_data = [
        {'first_name': 'Gabriel', 'last_name': 'García Márquez', 'nationality': 'Colombian', 'birth_date': '1927-03-06'},
        {'first_name': 'George', 'last_name': 'Orwell', 'nationality': 'British', 'birth_date': '1903-06-25'},
        {'first_name': 'Jane', 'last_name': 'Austen', 'nationality': 'British', 'birth_date': '1775-12-16'},
        {'first_name': 'Harper', 'last_name': 'Lee', 'nationality': 'American', 'birth_date': '1926-04-28'},
        {'first_name': 'F. Scott', 'last_name': 'Fitzgerald', 'nationality': 'American', 'birth_date': '1896-09-24'},
    ]
    
    for author_data in authors_data:
        author, created = Author.objects.get_or_create(
            first_name=author_data['first_name'],
            last_name=author_data['last_name'],
            defaults=author_data
        )
        if created:
            print(f"✓ Author '{author_data['first_name']} {author_data['last_name']}' created")
    
    # Create books
    books_data = [
        {
            'title': 'One Hundred Years of Solitude',
            'isbn': '978-0-06-088328-7',
            'description': 'A landmark novel that tells the story of the Buendía family over seven generations.',
            'publish_date': '1967-05-30',
            'pages': 417,
            'language': 'fr',
            'status': 'available',
            'author_name': 'Gabriel García Márquez',
            'category_name': 'Fiction'
        },
        {
            'title': '1984',
            'isbn': '978-0-452-28423-4',
            'description': 'A dystopian social science fiction novel about totalitarian control.',
            'publish_date': '1949-06-08',
            'pages': 328,
            'language': 'en',
            'status': 'available',
            'author_name': 'George Orwell',
            'category_name': 'Science-Fiction'
        },
        {
            'title': 'Pride and Prejudice',
            'isbn': '978-0-14-143951-8',
            'description': 'A romantic novel about manners, marriage, and society in Regency England.',
            'publish_date': '1813-01-28',
            'pages': 432,
            'language': 'en',
            'status': 'available',
            'author_name': 'Jane Austen',
            'category_name': 'Romance'
        },
        {
            'title': 'To Kill a Mockingbird',
            'isbn': '978-0-06-112008-4',
            'description': 'A novel about racial injustice and childhood in the American South.',
            'publish_date': '1960-07-11',
            'pages': 376,
            'language': 'en',
            'status': 'available',
            'author_name': 'Harper Lee',
            'category_name': 'Classique'
        },
        {
            'title': 'The Great Gatsby',
            'isbn': '978-0-7432-7356-5',
            'description': 'A critique of the American Dream through the story of Jay Gatsby.',
            'publish_date': '1925-04-10',
            'pages': 180,
            'language': 'en',
            'status': 'available',
            'author_name': 'F. Scott Fitzgerald',
            'category_name': 'Classique'
        },
        {
            'title': 'Animal Farm',
            'isbn': '978-0-452-28424-1',
            'description': 'An allegorical novella about a group of farm animals who rebel against their owner.',
            'publish_date': '1945-08-17',
            'pages': 112,
            'language': 'en',
            'status': 'available',
            'author_name': 'George Orwell',
            'category_name': 'Fiction'
        }
    ]
    
    for book_data in books_data:
        # Get author and category
        author_names = book_data['author_name'].split(' ')
        author = Author.objects.get(first_name=author_names[0], last_name=' '.join(author_names[1:]))
        category = Category.objects.get(name=book_data['category_name'])
        publisher = Publisher.objects.first()
        
        book, created = Book.objects.get_or_create(
            isbn=book_data['isbn'],
            defaults={
                'title': book_data['title'],
                'description': book_data['description'],
                'publish_date': book_data['publish_date'],
                'pages': book_data['pages'],
                'language': book_data['language'],
                'status': book_data['status'],
                'publisher': publisher,
                'created_by': admin_user
            }
        )
        
        if created:
            book.authors.add(author)
            book.categories.add(category)
            print(f"✓ Book '{book_data['title']}' created")
    
    print("\n✅ Sample data creation completed!")
    print("\nYou can now log in with:")
    print("Admin: admin@library.com / password")
    print("User: john.doe@email.com / password")

if __name__ == '__main__':
    create_sample_data()