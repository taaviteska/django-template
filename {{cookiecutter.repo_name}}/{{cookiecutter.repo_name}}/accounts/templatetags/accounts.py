from django import template
from django.utils.html import escapejs
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def js_user(user):
    if not user or user.is_anonymous:
        return mark_safe('null')

    {% raw %}user_template = '{{id:{id},username:"{username}",email:"{email}",name:"{name}"}}'{% endraw %}

    return mark_safe(user_template.format(
        id=user.id,
        username=escapejs(user.username),
        email=escapejs(user.email),
        name=escapejs(user.name),
    ))
