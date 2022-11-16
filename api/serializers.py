from email.headerregistry import HeaderRegistry
from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer): # class(extends/inherits)
    class Meta:
        model = Room
        # put the fields you want to be translated into JSON
        fields = '__all__'
        # fields = ('id', 'code', 'host', 'guest_can_pause', 
        #            'votes_to_skip', 'created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')
