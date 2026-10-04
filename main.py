# ==============================================================================
# SIMULADOR DISCRETO DE GESTIÓN DE MEMORIA Y PLANIFICACIÓN DE CPU
# Cátedra de Sistemas Operativos - Universidad de la Cuenca del Plata
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. ESTRUCTURAS DE DATOS (CLASES BASE)
# ------------------------------------------------------------------------------

class Proceso:
    """
    Representa el Bloque de Control de Proceso (PCB).
    Contiene la información de estado, requisitos y contadores de cada proceso.
    """
    def __init__(self, pid, tamano_memoria, tiempo_cpu_total):
        self.pid = pid                              # Identificador único (ej: "P1")
        self.tamano_memoria = tamano_memoria        # Memoria requerida en KB
        self.tiempo_cpu_total = tiempo_cpu_total    # Ticks totales que demanda la CPU
        self.tiempo_cpu_restante = tiempo_cpu_total # Ticks que le faltan para terminar
        
        # Estados: NUEVO, ESPERANDO_MEMORIA, LISTO, EJECUTANDO, BLOQUEADO, TERMINADO
        self.estado = "NUEVO"
        
        self.quantum_consumido = 0                  # Ticks consecutivos que lleva en CPU en su turno
        self.tiempo_bloqueo_restante = 0            # Ticks restantes que debe esperar en E/S
