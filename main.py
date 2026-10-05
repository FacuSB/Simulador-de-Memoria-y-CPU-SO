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


class BloqueMemoria:
    """
    Representa una partición contigua dentro del espacio total de la RAM.
    """
    def __init__(self, inicio, tamano, libre=True, pid=None):
        self.inicio = inicio                        # Dirección base en KB (ej: 0)
        self.tamano = tamano                        # Tamaño de la partición en KB
        self.libre = libre                          # True si está disponible, False si está ocupado
        self.pid = pid                              # PID del proceso que lo ocupa (o None si está libre)


# ------------------------------------------------------------------------------
# 2. ADMINISTRADOR DE MEMORIA (1024 KB, ASIGNACIONES Y COALESCENCIA)
# ------------------------------------------------------------------------------

class AdministradorMemoria:
    def __init__(self, tamano_total=1024):
        self.tamano_total = tamano_total
        # Al iniciar, la memoria completa es un único bloque libre
        self.bloques = [BloqueMemoria(inicio=0, tamano=tamano_total, libre=True)]

    def coalescencia(self):
        """
        Recorre la lista de particiones y fusiona bloques libres contiguos en uno solo.
        Esencial para reducir la fragmentación externa tras liberar memoria.
        """
        i = 0
        while i < len(self.bloques) - 1:
            actual = self.bloques[i]
            siguiente = self.bloques[i + 1]
            
            # Si dos bloques contiguos están libres, se unen sumando sus capacidades
            if actual.libre and siguiente.libre:
                actual.tamano += siguiente.tamano
                self.bloques.pop(i + 1)  # Se remueve el bloque duplicado
                # Nota: No incrementamos 'i' porque el bloque actual creció 
                # y podría volver a fusionarse con el que le sigue a la derecha
            else:
                i += 1

    def asignar_first_fit(self, proceso):
        """Busca el primer hueco libre donde quepa el proceso."""
        for i, bloque in enumerate(self.bloques):
            if bloque.libre and bloque.tamano >= proceso.tamano_memoria:
                self._partir_y_asignar(i, bloque, proceso)
                return True
        return False

    def asignar_best_fit(self, proceso):
        """Busca el bloque libre que deje el menor desperdicio de espacio residual."""
        mejor_idx = None
        menor_desperdicio = float('inf')

        for i, b in enumerate(self.bloques):
            if b.libre and b.tamano >= proceso.tamano_memoria:
                desperdicio = b.tamano - proceso.tamano_memoria
                if desperdicio < menor_desperdicio:
                    menor_desperdicio = desperdicio
                    mejor_idx = i

        if mejor_idx is not None:
            self._partir_y_asignar(mejor_idx, self.bloques[mejor_idx], proceso)
            return True
        return False

    def asignar_worst_fit(self, proceso):
        """Busca el bloque libre de mayor tamaño absoluto."""
        peor_idx = None
        mayor_tamano = -1

        for i, b in enumerate(self.bloques):
            if b.libre and b.tamano >= proceso.tamano_memoria:
                if b.tamano > mayor_tamano:
                    mayor_tamano = b.tamano
                    peor_idx = i

        if peor_idx is not None:
            self._partir_y_asignar(peor_idx, self.bloques[peor_idx], proceso)
            return True
        return False

    def _partir_y_asignar(self, indice, bloque, proceso):
        """Función interna: divide el bloque libre si sobra espacio y lo marca ocupado."""
        if bloque.tamano > proceso.tamano_memoria:
            sobrante = bloque.tamano - proceso.tamano_memoria
            nuevo_bloque_libre = BloqueMemoria(
                inicio=bloque.inicio + proceso.tamano_memoria,
                tamano=sobrante,
                libre=True,
                pid=None
            )
            bloque.tamano = proceso.tamano_memoria
            bloque.libre = False
            bloque.pid = proceso.pid
            self.bloques.insert(indice + 1, nuevo_bloque_libre)
        else:
            bloque.libre = False
            bloque.pid = proceso.pid

    def liberar(self, pid):
        """Libera la memoria de un proceso y ejecuta la coalescencia automática."""
        for b in self.bloques:
            if b.pid == pid:
                b.libre = True
                b.pid = None
                self.coalescencia()
                return True
        return False

    def obtener_metricas(self):
        """Calcula memoria libre, ocupada, mayor bloque contiguo y fragmentación externa."""
        memoria_ocupada = sum(b.tamano for b in self.bloques if not b.libre)
        memoria_libre_total = sum(b.tamano for b in self.bloques if b.libre)
        
        huecos_libres = [b.tamano for b in self.bloques if b.libre]
        mayor_hueco = max(huecos_libres) if huecos_libres else 0
        
        porcentaje_ocupacion = (memoria_ocupada / self.tamano_total) * 100
        
        # Fórmula exigida por la cátedra para fragmentación externa
        if memoria_libre_total > 0:
            frag_externa = (1.0 - (mayor_hueco / memoria_libre_total)) * 100.0
        else:
            frag_externa = 0.0

        return {
            "ocupada": memoria_ocupada,
            "libre_total": memoria_libre_total,
            "mayor_hueco": mayor_hueco,
            "porc_ocupacion": porcentaje_ocupacion,
            "frag_externa": frag_externa
        }

    def imprimir_mapa(self):
        """Muestra la tabla de bloques en consola."""
        print("   [MAPA DE MEMORIA]")
        for b in self.bloques:
            fin = b.inicio + b.tamano
            estado_str = f"OCUPADO por {b.pid}" if not b.libre else "LIBRE"
            print(f"   [{b.inicio:4d} KB - {fin:4d} KB] ({b.tamano:4d} KB) -> {estado_str}")
