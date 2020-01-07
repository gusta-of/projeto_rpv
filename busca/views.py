from django.shortcuts import render
from django.http import HttpResponse
from root.models import RegistroPassagem
import string
import datetime
from enum import unique

#from .forms import NameForm

# Create your views here.
def home(request):
      
    context = {}
    if request.method == 'POST':
        #passagens = RegistroPassagem.objects.using('passagens').all()[0:100]
        placa = request.POST.get('placa').upper()
        if request.POST.get('data_de'):
            data_de = datetime.datetime.strptime(request.POST.get('data_de'), "%Y-%m-%d").date()
            print(data_de)
        if request.POST.get('data_ate'):
            data_ate = datetime.datetime.strptime(request.POST.get('data_ate'), "%Y-%m-%d").date()
            data_ate = data_ate + datetime.timedelta(days=1)
            print(data_ate)

        if placa:
            if 'data_de' in locals() and 'data_ate' in locals():
                passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa, DATA_HORA__range=[data_de, data_ate]).order_by('DATA_HORA')
            elif 'data_de' in locals():
                passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa, DATA_HORA__gte=data_de).order_by('DATA_HORA')
            elif 'data_ate' in locals():
                passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa, DATA_HORA__lte=data_ate).order_by('DATA_HORA')
            else:
                passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa).order_by('DATA_HORA')
            #return HttpResponse(passagem.PLACA + "|" + passagem.SENTIDO + "|" + passagem.DATA_HORA.strftime('%X'))
            if passagens:
                #pontos = ""
                datas = []
                for p in passagens:
                    #pontos += "p[]=" +p.LOCAL_LATITUDE + "," + p.LOCAL_LONGITUDE + "&"
                    datas.append(p.DATA_HORA.strftime("%d/%m/%Y"))
                datas = list(set(datas))
                
                context = { 'passagens': passagens, 'datas': datas, 'data_de': request.POST.get('data_de',''), 'data_ate': request.POST.get('data_ate','')}


    return render(request, 'busca/index.html', context)

def mapa(request):
    #pegar o parametros da busca    
    if request.GET.get('placa'):
        placa = request.GET.get('placa').upper()
        if request.GET.get('data_de'):
            data_de = datetime.datetime.strptime(request.GET.get('data_de'), "%Y-%m-%d").date()
        if request.GET.get('data_ate'):
            data_ate = datetime.datetime.strptime(request.GET.get('data_ate'), "%Y-%m-%d").date()
            data_ate = data_ate + datetime.timedelta(days=1)

        if 'data_de' in locals() and 'data_ate' in locals():
            passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa, DATA_HORA__range=[data_de, data_ate]).order_by('DATA_HORA')
        elif 'data_de' in locals():
            passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa, DATA_HORA__gte=data_de).order_by('DATA_HORA')
        elif 'data_ate' in locals():
            passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa, DATA_HORA__lte=data_ate).order_by('DATA_HORA')
        else:
            passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa).order_by('DATA_HORA')
        return render(request, 'busca/mapa.html', {'passagens': passagens})

    #chamar a view passando o contexto
    return render(request, 'busca/mapa.html', {})

def rota(request):
    if request.GET.get('placa') and request.GET.get('data'):
        placa = request.GET.get('placa').upper()
        data = datetime.datetime.strptime(request.GET.get('data'), "%d/%m/%Y")
        data_de = datetime.datetime.combine(data, datetime.time.min)
        data_ate = datetime.datetime.combine(data, datetime.time.max)
        #print(placa, data)
        passagens = RegistroPassagem.objects.using('passagens').filter(PLACA=placa, DATA_HORA__range=[data_de,data_ate]).order_by('DATA_HORA')
        return render(request, 'busca/rota.html', {'passagens': passagens})

def pontos_captura(request):
    return render(request, 'busca/mapa_dataTraffic.html')