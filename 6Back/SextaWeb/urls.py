from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/rx/', include('Rx.urls')),
    path('api/pharmago/', include('PharmaGo.urls')),
    path('api/numbers/', include('Numbers.urls')),
]
