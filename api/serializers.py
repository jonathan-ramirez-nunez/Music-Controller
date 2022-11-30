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

class UpdateRoomSerializer(serializers.ModelSerializer):
    '''A serializer will return an invalid response/error if it is given a 
    field, such as 'code', that it has seen before. For this serializer, we 
    don't want this to happen bc we will use this serializer to UPDATE an
    existing room so we will definitely end up passing the same room 'code'
    to this serializer. To avoid this issue, we redefine CharField inside this
    serializer so we don't reference the CharField inside the model.
    '''
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')
