from django.urls import path
from .views import CreateRoomView, RoomView, GetRoom, JoinRoom, UserInRoom

urlpatterns = [
    path('room', RoomView.as_view()), 
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()), 
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view())
]
# whatever the url is '', call the imported main() from views.py

# if instead 'page2', then you get error page and 
# need to manually add '/page2' to the end of the url to get the page
# http://127.0.0.1:8000/home

# https://youtu.be/JD-age0BPVo?t=896