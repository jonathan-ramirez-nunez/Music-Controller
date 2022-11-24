from django.shortcuts import render
from rest_framework import generics, status # http status codes like 404
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView # we can define a get, post, put method, etc.
from rest_framework.response import Response # send a custom response from our view
from rest_framework.request import Request
from django.http import JsonResponse

# code = request.GET.get(...        <- use this syntax for a GET request
# code = request.data.get(...        <- use this syntax for a POST request

class RoomView(generics.ListAPIView):
    '''this class will allow to view the rooms as a Python QuerySet object
    or as RoomSerializer object'''
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    # learned how to set up a serializer, view, model to get to this point

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)       # lookup the Room Code for the session and assign to 'code'
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data # .data is a python dict
                data['is_host'] = self.request.session.session_key == room[0].host # creating a new data entry with 'is_host' as the key
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response ({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        # if our current user has an active session with our web server (like logged into FB)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code) # will try to find the room the user wants to join
            if len(room_result) > 0:
                room  = room_result[0]
                # besides allowing the user to join, we will also take note of this join
                # in the backend for bookkeeping purposes. This can be seen as a temporary
                # room object for the session with the variable as 'room_code' and value as code.
                self.request.session['room_code'] = code
                return Response({'message':'Room Joined!'}, status=status.HTTP_200_OK)
            return Response({'Bad Request':'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST) # no room found with code given
        return Response({'Bad Request':'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST) # user messed up request (code==None)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post (self, request, format=None):
        # if our current user has an active session with our web server (like logged into FB)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            # https://youtu.be/k6ELzQgPHMM?t=775
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                # add the active room
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause','votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request':'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        # if our current user has an active session with our web server (like logged into FB)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        # we will handle telling user not already in a room on the frontend
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code') # returns the room_code if needed
            # Now check if this session's user is the host of a room
            # If so, then remove them from said room.
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
                
        # this Response will be sent regardless if the user was the host of a room or not
        # can change this function to account for user not being a host
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


'''
from django.http import HttpResponse
def main(request):
    return HttpResponse("Hello\t<h1>Hello again</h1>")
'''