# from django.conf.urls.defaults import patterns, include, url
from django.urls import path
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from .views import SuggestionView
from .constants import *

urlpatterns = [
    path(ADMIN, admin.site.urls),
    path(SUGGESTIONS, SuggestionView.as_view()),
]
