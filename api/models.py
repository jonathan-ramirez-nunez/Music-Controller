import code
from django.db import models
import string
import random


def generate_unique_code():
    '''code variable = generates a random code that is k length and 
    only contains the uppercase ascii characters.
    Check this code variable against every Room code and return it if hasn't
    been used'''
    length = 6 # not 8 like in table incase we add too many rooms that we run out of codes
    
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break
    
    return code

# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    # unique host means 1 host cannot host multiple rooms
    host = models.CharField(max_length=50, unique=True)
    # null means we must pass a value?
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)


