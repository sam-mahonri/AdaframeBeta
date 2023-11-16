import redis
from . import samenv

redis_client = redis.StrictRedis(
    host=samenv.get('REDIS_HOST'), 
    port=samenv.get('REDIS_PORT'), 
    decode_responses=True, 
    db=samenv.get('REDIS_DBINDEX'),
    password=samenv.get('REDIS_PASSWORD')
    )

