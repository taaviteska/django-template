from django.contrib.auth.models import AnonymousUser
from django.test import TestCase

from accounts.models import User
from accounts.templatetags.accounts import js_user


class AccountExtrasTestCase(TestCase):

    @staticmethod
    def generate_json(user_id, username='taavi', email='', name=''):
        return '{id:%s,username:"%s",email:"%s",name:"%s"}' % (
            user_id, username, email, name,
        )

    def test_js_user(self):
        user = User.objects.create_user('taavi')
        result = js_user(user)
        self.assertEqual(result, self.generate_json(user.id))

        user.email = 'taavi@test.com'
        result = js_user(user)
        self.assertEqual(result, self.generate_json(user.id, email='taavi@test.com'))

        user.name = 'Taavi Teska'
        result = js_user(user)
        self.assertEqual(result, self.generate_json(user.id, email='taavi@test.com', name='Taavi Teska'))

        user.name = '" \' \\ Teska'
        result = js_user(user)
        self.assertEqual(result, self.generate_json(
            user.id, email='taavi@test.com', name='\\u0022 \\u0027 \\u005C Teska',
        ))

        # Try to save the user - we should not get any errors
        user.save()

    def test_js_user_anonymous(self):
        user = AnonymousUser()

        result = js_user(user)
        self.assertEqual(result, 'null')

    def test_js_user_safe_string(self):
        user = User.objects.create_user('taavi')
        result = js_user(user)
        self.assertEqual(result, result.__html__())

        user = AnonymousUser()
        result = js_user(user)
        self.assertEqual(result, result.__html__())
