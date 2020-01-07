from djongo import models

# Create your models here.
class RegistroPassagem(models.Model):
    _id = models.ObjectIdField()
    DATA_HORA = models.DateTimeField()
    LOCAL = models.IntegerField()
    RODOVIA = models.CharField(max_length=100)
    KM = models.CharField(max_length=100)
    METRO = models.CharField(max_length=100)
    SENTIDO = models.CharField(max_length=100)
    FAIXA = models.IntegerField()
    VELOCIDADE_PERMITIDA = models.IntegerField()
    VELOCIDADE_AFERIDA = models.IntegerField()
    CLASSIFICACAO = models.IntegerField()
    PLACA = models.CharField(max_length=100)
    CODIGO_INFRACAO = models.IntegerField()
    arquivo_origem = models.CharField(max_length=100)
    CODIGO_LOCAL = models.IntegerField()
    LOCAL_LATITUDE = models.CharField(max_length=100)
    LOCAL_LONGITUDE = models.CharField(max_length=100)
    COD_CLASSIFICACAO = models.IntegerField()
    DESC_CLASSIFICACAO = models.CharField(max_length=100)
    RAND_RANK = models.FloatField()

    class Meta:
        managed = False
        db_table = "registro_passagem"