# Create your views here.
from tools import lrender

@lrender('IMG/home.html')
def home(request):
    return {}