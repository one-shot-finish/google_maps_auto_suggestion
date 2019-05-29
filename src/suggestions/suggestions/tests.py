from rest_framework.test import APIRequestFactory
from .constants import *
import random
import string, json
from .views import SuggestionView
from rest_framework.request import Request
from django.http.request import QueryDict

class Test:

    def requester(self):
        URL = BASE_URL + SUGGESTIONS

        combs = set()

        #   FRAME RANDOM COMBINATIONS OF ALPHABETS RANGING FROM LENGTH 1-10 TO CHECK ITS WORKING
        for i in range(10):
            for j in range(100):
                combs.add(self.generate_combinations(i))
        factory = APIRequestFactory()
        request = Request(factory.get(URL))

        #   SENDS REQUEST TO get METHOD EMULATING ORIGINAL REQUEST STRUCTURE TO DETECT ERRORS IF ANY
        for comb in combs:
            request._request.GET = QueryDict(QUERY_STRING+EQUALS+comb)
            suggestion_view = SuggestionView()
            response = suggestion_view.get(request)
            if self.validate_response(response):
                print(TEST_SUCCESS_MESSAGE)
            else:
                print(TEST_FAILURE_MESSAGE)


    #   GENERATES ALPHABET COMBINATIONS FOR A GIVEN LENGTH NUM
    def generate_combinations(self, num):
        if num >= 1:
            return random.choice(string.ascii_letters) + self.generate_combinations(num-1)
        else:
            return EMPTY_STRING

    #   VALIDATES RESPONSE TO CHECK IF SUGGESTIONS KEY IS PRESENT
    def validate_response(self, response):
        response_json = response.content
        return SUGGESTIONS in dict(json.loads(response_json))
