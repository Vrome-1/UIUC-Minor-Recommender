# # myproject/urls.py
# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include('minorproject.urls')), 
# ]

# backApp/urls.py
from django.urls import path
from . import backend

urlpatterns = [
    path('', backend.home, name='home'),
    path('api/classNames/', backend.classNames, name='classNames'),
    path('api/minor_progress/', backend.minor_progress, name='minor_progress'),
    path('api/subjectNames/', backend.subjectNames, name='subjectNames'),
    path('api/job_recommendations/', backend.job_recommendations, name='job_recommendations'),
    path('api/career_insights/', backend.career_insights, name='career_insights'),
]