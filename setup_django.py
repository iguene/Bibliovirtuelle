import subprocess
import sys
import os

def install_requirements():
    """Install Python dependencies from requirements.txt"""
    print("Installing Python dependencies...")
    
    try:
        # Install dependencies
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def setup_django():
    """Setup Django database and create sample data"""
    print("\nSetting up Django...")
    
    try:
        # Run migrations
        print("Running database migrations...")
        subprocess.check_call([sys.executable, 'manage.py', 'migrate'])
        print("✅ Database migrations completed!")
        
        # Create sample data
        print("Creating sample data...")
        subprocess.check_call([sys.executable, 'create_sample_data.py'])
        print("✅ Sample data created!")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Django setup failed: {e}")
        return False

def main():
    print("🚀 Setting up Django backend for Library Management System")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("❌ Error: manage.py not found. Please run this script from the Django project directory.")
        return
    
    # Install dependencies
    if not install_requirements():
        print("\n❌ Setup failed at dependency installation.")
        return
    
    # Setup Django
    if not setup_django():
        print("\n❌ Setup failed at Django configuration.")
        return
    
    print("\n" + "=" * 60)
    print("🎉 Django backend setup completed successfully!")
    print("\nYou can now start the Django server with:")
    print("python manage.py runserver")
    print("\nDemo accounts:")
    print("• Admin: admin@library.com / password")
    print("• User: john.doe@email.com / password")

if __name__ == '__main__':
    main()