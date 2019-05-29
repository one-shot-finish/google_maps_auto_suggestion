from rest_framework.views import APIView
from django.http import JsonResponse
from pymongo import MongoClient
from bson.json_util import dumps
import json
from .constants import *

class SuggestionView(APIView):
    request = None

    def get(self, request):
        self.request = request
        matcher, permitted_params = self.get_permitted_params()
        if matcher is None:
            response = {
                SUCCESS: False,
                SUGGESTIONS: {}
            }
            return JsonResponse(response)
        else:
            response = {
                SUCCESS: True,
                SUGGESTIONS: self.get_compatible_response(matcher, permitted_params)
            }
            return JsonResponse(response, safe=False)

    #   METHOD RETURNING ONLY THOSE PARAMS WHICH ARE PERMITTED TO UNDERGO FURTHER SCREENING
    def get_permitted_params(self):
        params  = dict()
        request = self.request
        matcher = request.query_params.get(QUERY_STRING)
        if matcher is None:
            return None, {}
        params[ID]            = request.query_params.get(ID)
        params[ASCII]         = request.query_params.get(ASCII)
        params[LATITUDE]      = request.query_params.get(LATITUDE)
        params[LONGITUDE]     = request.query_params.get(LONGITUDE)
        params[FEAT_CLASS]    = request.query_params.get(FEAT_CLASS)
        params[FEAT_CODE]     = request.query_params.get(FEAT_CODE)
        params[COUNTRY]       = request.query_params.get(COUNTRY)
        params[CC2]           = request.query_params.get(CC2)
        params[ADMIN1]        = request.query_params.get(ADMIN1)
        params[ADMIN2]        = request.query_params.get(ADMIN2)
        params[ADMIN3]        = request.query_params.get(ADMIN3)
        params[ADMIN4]        = request.query_params.get(ADMIN4)
        params[POPULATION]    = request.query_params.get(POPULATION)
        params[ELEVATION]     = request.query_params.get(ELEVATION)
        params[DEM]           = request.query_params.get(DEM)
        params[TZ]            = request.query_params.get(TZ)
        params[MODIFIED_AT]   = request.query_params.get(MODIFIED_AT)

        params = {k: v for k, v in params.items() if v is not None}
        return matcher, params

    #   FRAMES RESPONSE STRUCTURE BY RUNNING THE REQUIRED QUERY USING PERMITTED PARAMS
    def get_compatible_response(self, matcher, permitted_params):
        client = MongoClient()
        db = client.mydb
        matcher_params = permitted_params
        matcher_params[NAME] = {
            MONGO_REGEX: MONGO_ANYTHING+matcher+MONGO_ANYTHING,
            MONGO_OPTIONS: MONGO_IGNORECASE
        }
        cursor = db.suggestions.aggregate([
            {
                MONGO_MATCH: matcher_params
            }, {
                MONGO_SORT: {
                    POPULATION: -1
                }
            }, {
                MONGO_PROJECT: {MONGO_ID: 0}
            }, {
                MONGO_LIMIT: MAX_QUERY_RESULT_LIMIT
            }
        ])
        response = json.loads(dumps(cursor))
        return response
