from django.conf.urls import url
from django.contrib.auth.views import LoginView, LogoutView

from accounts.forms import LoginForm


urlpatterns = [
    url(
        r'^login/$',
        LoginView.as_view(form_class=LoginForm, template_name='accounts/login.html', redirect_authenticated_user=True),
        name='login',
    ),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),
]
