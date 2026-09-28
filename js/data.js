/* Ejercicios, grupos de variaciones y rutinas. */
(function () {
  const E = {};
  // id, nombre, nombre en inglés, grupo, pose, implemento, músculos {m, s}, técnica, errores, tempo, descanso (s), extras
  function X(id, n, en, g, pose, prop, mus, c, e, t, r, o) {
    E[id] = Object.assign({ id, n, en, g, pose, prop, m: mus[0], s: mus[1], c, e, t, r, inc: 2.5 }, o || {});
  }

  /* ---------- PECHO ---------- */
  X('press_banca', 'Press de banca con barra', 'barbell bench press', 'pecho_h', 'bench', 'bar',
    [['Pectoral mayor'], ['Tríceps', 'Deltoides anterior']],
    ['Escápulas juntas y abajo, como metiéndolas en los bolsillos de atrás',
     'Pies firmes en el piso y un arco leve en la espalda alta',
     'Baja la barra controlada a la parte baja del pecho, codos a unos 45-70° del torso',
     'Empuja hacia arriba y un poco hacia atrás, buscando la línea de los hombros'],
    ['Rebotar la barra en el pecho', 'Codos abiertos a 90°: castiga el hombro', 'Levantar la cola del banco'],
    '3-1-X', 180);
  X('press_banca_manc', 'Press de banca con mancuernas', 'dumbbell bench press', 'pecho_h', 'bench', 'db',
    [['Pectoral mayor'], ['Tríceps', 'Deltoides anterior']],
    ['Sube las mancuernas apoyándolas en los muslos y acuéstate con ellas pegadas al pecho',
     'Baja hasta sentir estiramiento en el pecho, antebrazos verticales',
     'Arriba acerca las mancuernas sin chocarlas',
     'Escápulas atrás todo el tiempo'],
    ['Bajar poquito por miedo al peso', 'Dejar caer las mancuernas sin control', 'Muñecas dobladas hacia atrás'],
    '3-0-1', 120, { inc: 2 });
  X('press_maquina_pecho', 'Press de pecho en máquina', 'machine chest press', 'pecho_h', 'chestpress', 'machine',
    [['Pectoral mayor'], ['Tríceps', 'Deltoides anterior']],
    ['Ajusta el asiento para que las manijas queden a la altura del pecho medio',
     'Espalda y cabeza pegadas al respaldo',
     'Empuja sin trabar los codos del todo',
     'Regresa lento hasta sentir el estiramiento'],
    ['Asiento muy alto o muy bajo', 'Despegar los hombros del respaldo', 'Ir rápido en la bajada'],
    '3-0-1', 90);
  X('flexiones_lastre', 'Flexiones con lastre', 'weighted push up', 'pecho_h', 'pushup', 'bw',
    [['Pectoral mayor'], ['Tríceps', 'Deltoides anterior', 'Core']],
    ['Manos un poco más anchas que los hombros',
     'Cuerpo en línea recta de cabeza a talones, glúteo apretado',
     'Baja hasta que el pecho casi toque el piso',
     'Lastre: disco en la espalda alta o chaleco'],
    ['Cadera caída', 'Codos totalmente abiertos', 'Recorrido a medias'],
    '2-1-1', 90, { bw: true });

  X('press_inclinado_manc', 'Press inclinado con mancuernas', 'incline dumbbell press', 'pecho_inc', 'incline', 'db',
    [['Pectoral superior'], ['Deltoides anterior', 'Tríceps']],
    ['Banco a 30-45°, no más, si no se vuelve press de hombro',
     'Las mancuernas bajan a la altura de la parte alta del pecho',
     'Codos un poco por debajo de la línea de los hombros',
     'Empuja arriba y un poco hacia adentro'],
    ['Banco demasiado vertical', 'Arquear tanto que se vuelve press plano', 'Chocar las mancuernas arriba'],
    '3-0-1', 120, { inc: 2 });
  X('press_inclinado_barra', 'Press inclinado con barra', 'incline barbell bench press', 'pecho_inc', 'incline', 'bar',
    [['Pectoral superior'], ['Deltoides anterior', 'Tríceps']],
    ['Banco a unos 30°',
     'Baja la barra a la parte alta del pecho, debajo de la clavícula',
     'Escápulas atrás y abajo, pies firmes',
     'Sube en línea recta sobre los hombros'],
    ['Bajar la barra al cuello', 'Rebotar', 'Perder la posición de las escápulas al subir'],
    '3-1-X', 180);
  X('press_inclinado_smith', 'Press inclinado en Smith', 'smith machine incline press', 'pecho_inc', 'incline', 'bar',
    [['Pectoral superior'], ['Deltoides anterior', 'Tríceps']],
    ['Ubica el banco para que la barra caiga en la parte alta del pecho',
     'Banco a unos 30°',
     'Controla la bajada 2-3 s',
     'Aprovecha la estabilidad para acercarte al fallo con seguridad'],
    ['Banco mal ubicado: la barra cae en el cuello o el abdomen', 'No revisar los seguros', 'Recorrido corto'],
    '3-0-1', 120);
  X('press_inclinado_maquina', 'Press inclinado en máquina', 'incline machine press', 'pecho_inc', 'chestpress', 'machine',
    [['Pectoral superior'], ['Deltoides anterior', 'Tríceps']],
    ['Asiento para que las manijas queden a la altura de la parte alta del pecho',
     'Hombros atrás y abajo',
     'Empuja sin trabar los codos',
     'Regreso lento'],
    ['Encoger los hombros', 'Ir con impulso', 'Recorrido parcial'],
    '3-0-1', 90);

  X('aperturas_polea', 'Cruce de poleas', 'cable fly', 'pecho_ais', 'fly', 'cable',
    [['Pectoral mayor'], ['Deltoides anterior']],
    ['Poleas a la altura de los hombros o un poco más arriba',
     'Codos un poco doblados y fijos, como abrazando un árbol',
     'Junta las manos frente al pecho y aprieta 1 s',
     'Abre controlado hasta sentir estiramiento'],
    ['Doblar y estirar codos: se vuelve press', 'Mucho peso y mover el torso', 'Abrir tanto que el hombro se va adelante'],
    '2-1-1', 75);
  X('pec_deck', 'Pec deck (aperturas en máquina)', 'pec deck fly', 'pecho_ais', 'fly', 'machine',
    [['Pectoral mayor'], ['Deltoides anterior']],
    ['Asiento para que las manijas queden a la altura del pecho',
     'Espalda pegada al respaldo',
     'Junta las manijas apretando el pecho',
     'Vuelve lento hasta estirar'],
    ['Hombros hacia adelante al cerrar', 'Soltar el peso de golpe', 'Rango corto'],
    '2-1-1', 75);
  X('aperturas_manc', 'Aperturas con mancuernas', 'dumbbell fly', 'pecho_ais', 'fly', 'db',
    [['Pectoral mayor'], ['Deltoides anterior']],
    ['Acostado en banco plano, mancuernas arriba con palmas enfrentadas',
     'Codos semiflexionados y fijos',
     'Baja en arco hasta sentir estiramiento, sin pasar mucho la línea del torso',
     'Sube como abrazando'],
    ['Bajar demasiado con peso pesado', 'Convertirlo en press', 'Codos rectos'],
    '3-0-1', 75, { inc: 1 });

  /* ---------- HOMBRO ---------- */
  X('press_militar', 'Press militar de pie', 'standing overhead press', 'hombro_v', 'ohp', 'bar',
    [['Deltoides anterior'], ['Tríceps', 'Deltoides lateral', 'Core']],
    ['Barra en la parte alta del pecho, agarre un poco más ancho que los hombros',
     'Glúteos y abdomen apretados, sin arquear la lumbar',
     'Echa la cabeza atrás para que pase la barra y métela debajo al subir',
     'Termina con la barra sobre la mitad del pie'],
    ['Arquear la espalda baja para ayudarte', 'Empujar la barra hacia adelante', 'Codos muy abiertos al inicio'],
    '2-0-X', 150);
  X('press_hombro_manc', 'Press de hombro sentado con mancuernas', 'seated dumbbell shoulder press', 'hombro_v', 'ohp', 'db',
    [['Deltoides anterior'], ['Tríceps', 'Deltoides lateral']],
    ['Banco a 80-90°',
     'Mancuernas a la altura de las orejas, codos un poco hacia adelante',
     'Sube sin chocarlas',
     'Baja hasta la barbilla o un poco más'],
    ['Arquear la espalda y despegarla', 'Bajar poquito', 'Codos abiertos a 90°'],
    '3-0-1', 120, { inc: 2 });
  X('press_hombro_maquina', 'Press de hombro en máquina', 'machine shoulder press', 'hombro_v', 'ohp', 'machine',
    [['Deltoides anterior'], ['Tríceps', 'Deltoides lateral']],
    ['Asiento con las manijas a la altura de los hombros',
     'Espalda pegada al respaldo',
     'Sube sin trabar',
     'Baja controlado'],
    ['Encoger los hombros', 'Rango corto', 'Impulso con las piernas'],
    '3-0-1', 90);
  X('landmine_press', 'Press landmine', 'landmine press', 'hombro_v', 'ohp', 'bar',
    [['Deltoides anterior'], ['Pectoral superior', 'Tríceps', 'Core']],
    ['Barra anclada en una esquina o landmine, extremo a la altura del hombro',
     'De pie o arrodillado, abdomen firme',
     'Empuja arriba y adelante siguiendo el arco de la barra',
     'Buena opción si te molesta el hombro en el press vertical'],
    ['Girar el torso para empujar', 'Arquear la lumbar', 'Perder el control al bajar'],
    '2-0-1', 90);

  X('elev_laterales_manc', 'Elevaciones laterales con mancuernas', 'dumbbell lateral raise', 'hombro_lat', 'lateral', 'db',
    [['Deltoides lateral'], ['Trapecio superior', 'Supraespinoso']],
    ['Torso un poco inclinado adelante, codos apenas doblados',
     'Sube llevando los codos hacia afuera, no las manos',
     'Hasta la altura de los hombros, no más',
     'Baja lento, 2-3 s'],
    ['Balancear el cuerpo para subir', 'Encoger los hombros hacia las orejas', 'Tanto peso que parece un remo'],
    '2-1-1', 60, { inc: 1 });
  X('elev_laterales_polea', 'Elevación lateral en polea', 'cable lateral raise', 'hombro_lat', 'lateral', 'cable',
    [['Deltoides lateral'], ['Trapecio superior', 'Supraespinoso']],
    ['Polea baja, un brazo a la vez',
     'Agárrate de la máquina con la otra mano',
     'Sube hasta la línea del hombro',
     'La polea mantiene tensión abajo: no descanses ahí'],
    ['Rotar el torso', 'Encoger el hombro', 'Ir rápido'],
    '2-1-1', 60);
  X('elev_laterales_maquina', 'Elevaciones laterales en máquina', 'machine lateral raise', 'hombro_lat', 'lateral', 'machine',
    [['Deltoides lateral'], ['Trapecio superior']],
    ['Hombros alineados con el eje de la máquina',
     'Empuja con los codos, no con las manos',
     'Pausa arriba 1 s',
     'Baja controlado'],
    ['Asiento mal ajustado', 'Encoger los hombros', 'Usar impulso'],
    '2-1-1', 60);

  X('face_pull', 'Face pull', 'face pull', 'hombro_post', 'facepull', 'cable',
    [['Deltoides posterior'], ['Trapecio medio e inferior', 'Manguito rotador']],
    ['Polea a la altura de la cara, con cuerda',
     'Tira hacia la cara separando las puntas de la cuerda',
     'Codos altos: terminas con los puños a los lados de las orejas',
     'Pausa 1 s atrás'],
    ['Echarte atrás y tirar con la espalda baja', 'Codos abajo: se vuelve remo', 'Peso excesivo'],
    '2-1-1', 60);
  X('pajaros_manc', 'Pájaros con mancuernas', 'rear delt dumbbell fly', 'hombro_post', 'reversefly', 'db',
    [['Deltoides posterior'], ['Trapecio medio', 'Romboides']],
    ['Torso casi paralelo al piso o pecho apoyado en banco inclinado',
     'Codos semiflexionados',
     'Abre los brazos hacia los lados, no hacia atrás',
     'Controla la bajada'],
    ['Usar impulso del torso', 'Juntar demasiado las escápulas (trabaja más trapecio)', 'Peso alto'],
    '2-1-1', 60, { inc: 1 });
  X('reverse_pec_deck', 'Pec deck invertido', 'reverse pec deck', 'hombro_post', 'reversefly', 'machine',
    [['Deltoides posterior'], ['Trapecio medio', 'Romboides']],
    ['Pecho contra el respaldo, manijas a la altura de los hombros',
     'Brazos casi rectos',
     'Abre hacia los lados empujando con la parte de atrás del hombro',
     'Pausa 1 s'],
    ['Encoger los hombros', 'Rebotar', 'Rango corto'],
    '2-1-1', 60);

  /* ---------- TRÍCEPS ---------- */
  X('ext_triceps_polea', 'Extensión de tríceps en polea', 'cable triceps pushdown', 'triceps', 'pushdown', 'cable',
    [['Tríceps'], []],
    ['Codos pegados a los costados y quietos',
     'Extiende hasta bloquear y abre la cuerda abajo',
     'Sube hasta que el antebrazo pase la horizontal',
     'Torso firme, un poco inclinado'],
    ['Mover los codos adelante y atrás', 'Echar el cuerpo encima del peso', 'Rango corto arriba'],
    '2-1-1', 60);
  X('fondos', 'Fondos en paralelas', 'dips', 'triceps', 'dip', 'bw',
    [['Tríceps', 'Pectoral inferior'], ['Deltoides anterior']],
    ['Hombros abajo, lejos de las orejas',
     'Baja hasta que el brazo quede paralelo al piso',
     'Torso vertical = más tríceps; inclinado = más pecho',
     'Sube sin trabar de golpe'],
    ['Bajar demasiado si te duele el hombro', 'Encoger los hombros', 'Balancear las piernas'],
    '2-0-1', 120, { bw: true });
  X('press_cerrado', 'Press de banca agarre cerrado', 'close grip bench press', 'triceps', 'bench', 'bar',
    [['Tríceps'], ['Pectoral mayor', 'Deltoides anterior']],
    ['Agarre al ancho de los hombros, no más cerrado',
     'Codos pegados al cuerpo',
     'Baja a la parte baja del pecho',
     'Empuja firme'],
    ['Agarre demasiado cerrado: sufren las muñecas', 'Abrir codos', 'Rebotar'],
    '3-0-1', 150);
  X('ext_triceps_una_mano', 'Extensión de tríceps a una mano', 'single arm cable pushdown', 'triceps', 'pushdown', 'cable',
    [['Tríceps'], []],
    ['Manija sencilla o agarrando el cable',
     'Codo fijo al costado',
     'Extiende completo',
     'Controla la subida'],
    ['Mover el hombro', 'Girar el torso', 'Ir rápido'],
    '2-1-1', 60);

  X('ext_triceps_sobre_cabeza', 'Extensión de tríceps sobre la cabeza en polea', 'overhead cable triceps extension', 'triceps_oh', 'ohext', 'cable',
    [['Tríceps (cabeza larga)'], []],
    ['Dale la espalda a la polea con la cuerda sobre la cabeza',
     'Codos apuntando al frente, cerca de la cabeza',
     'Extiende completo arriba',
     'Baja hasta sentir el estiramiento detrás'],
    ['Abrir los codos', 'Arquear la lumbar', 'Rango corto'],
    '3-0-1', 75);
  X('ext_sobre_cabeza_manc', 'Extensión sobre la cabeza con mancuerna', 'overhead dumbbell triceps extension', 'triceps_oh', 'ohext', 'db',
    [['Tríceps (cabeza larga)'], []],
    ['Sentado con respaldo, mancuerna con ambas manos',
     'Codos al frente',
     'Baja detrás de la cabeza hasta estirar',
     'Extiende sin mover los codos'],
    ['Abrir los codos', 'Arquear la espalda', 'Peso excesivo'],
    '3-0-1', 75, { inc: 2 });
  X('press_frances', 'Press francés con barra Z', 'ez bar skull crusher', 'triceps_oh', 'skull', 'bar',
    [['Tríceps'], []],
    ['Acostado, barra Z con los brazos verticales',
     'Inclina un poco los brazos hacia atrás para mantener tensión',
     'Baja hacia la frente o detrás de la cabeza doblando solo los codos',
     'Extiende sin mover los hombros'],
    ['Abrir los codos', 'Mover los hombros: se vuelve pullover', 'Bajar sin control hacia la cara'],
    '3-0-1', 90);

  /* ---------- ESPALDA ---------- */
  X('dominadas', 'Dominadas', 'pull up', 'espalda_v', 'pullup', 'bw',
    [['Dorsal ancho'], ['Bíceps', 'Romboides', 'Trapecio inferior']],
    ['Agarre un poco más ancho que los hombros',
     'Arranca colgado con brazos extendidos y hombros activos',
     'Tira llevando los codos hacia los bolsillos',
     'Pasa la barbilla sobre la barra y baja controlado'],
    ['Medias repeticiones', 'Balancearte (kipping)', 'Encoger los hombros arriba'],
    '2-0-1', 150, { bw: true });
  X('jalon_pecho', 'Jalón al pecho', 'lat pulldown', 'espalda_v', 'pulldown', 'cable',
    [['Dorsal ancho'], ['Bíceps', 'Romboides', 'Deltoides posterior']],
    ['Muslos bien trabados bajo el soporte',
     'Torso un poco inclinado atrás',
     'Lleva la barra a la parte alta del pecho con los codos hacia abajo',
     'Sube controlado hasta estirar'],
    ['Tirar detrás de la nuca', 'Echarte muy atrás: se vuelve remo', 'Usar impulso'],
    '2-1-1', 90);
  X('jalon_neutro', 'Jalón agarre neutro', 'neutral grip lat pulldown', 'espalda_v', 'pulldown', 'cable',
    [['Dorsal ancho'], ['Bíceps', 'Braquial', 'Romboides']],
    ['Manija en V o agarre neutro',
     'Pecho arriba',
     'Tira hacia la parte baja del pecho',
     'Estira completo arriba'],
    ['Tirar con los brazos sin sentir la espalda', 'Balanceo', 'Rango corto'],
    '2-1-1', 90);
  X('dominadas_asistidas', 'Dominadas asistidas', 'assisted pull up', 'espalda_v', 'pullup', 'machine',
    [['Dorsal ancho'], ['Bíceps', 'Romboides']],
    ['En máquina o con banda elástica, misma técnica que la dominada',
     'Anota la asistencia en negativo (ej: -20 kg): así la app sabe que mejoraste cuando baja',
     'Baja la asistencia cuando llegues al tope de reps',
     'Controla la bajada'],
    ['Demasiada asistencia', 'Medias repeticiones', 'Encoger los hombros'],
    '2-0-1', 90, { bw: true });

  X('remo_barra', 'Remo con barra', 'barbell row', 'espalda_h', 'row', 'bar',
    [['Dorsal ancho', 'Romboides', 'Trapecio medio'], ['Bíceps', 'Deltoides posterior', 'Erectores']],
    ['Bisagra de cadera, torso a 30-45° del piso y espalda neutra',
     'Agarre al ancho de los hombros',
     'Tira la barra hacia el ombligo llevando los codos atrás',
     'Baja controlado sin perder la posición'],
    ['Enderezar el torso en cada repetición', 'Redondear la espalda baja', 'Tirar con impulso de cadera'],
    '2-1-1', 150);
  X('remo_mancuerna', 'Remo con mancuerna a una mano', 'one arm dumbbell row', 'espalda_h', 'row', 'db',
    [['Dorsal ancho'], ['Romboides', 'Bíceps', 'Deltoides posterior']],
    ['Mano y rodilla apoyadas en el banco, espalda plana',
     'Tira la mancuerna hacia la cadera, no hacia el hombro',
     'Abajo deja que el hombro baje un poco para estirar',
     'Sin girar el torso'],
    ['Rotar el torso para subir', 'Tirar hacia el pecho', 'Encoger el hombro'],
    '2-1-1', 90, { inc: 2 });
  X('remo_polea_sentado', 'Remo en polea sentado', 'seated cable row', 'espalda_h', 'rowseat', 'cable',
    [['Dorsal ancho', 'Romboides'], ['Bíceps', 'Trapecio medio']],
    ['Rodillas un poco dobladas, espalda neutra',
     'Tira la manija hacia el abdomen',
     'Junta las escápulas al final',
     'Estira adelante sin redondear'],
    ['Balancear el torso', 'Encoger los hombros', 'Tirar solo con los brazos'],
    '2-1-1', 90);
  X('remo_pecho_apoyado', 'Remo con pecho apoyado', 'chest supported row', 'espalda_h', 'row', 'db',
    [['Dorsal ancho', 'Romboides', 'Trapecio medio'], ['Bíceps', 'Deltoides posterior']],
    ['Pecho sobre banco inclinado o máquina T',
     'Tira con los codos hacia atrás',
     'Pausa 1 s arriba',
     'Baja estirando'],
    ['Despegar el pecho del banco', 'Rango corto', 'Encoger los hombros'],
    '2-1-1', 90, { inc: 2 });

  /* ---------- BÍCEPS ---------- */
  X('curl_barra', 'Curl con barra', 'barbell curl', 'biceps', 'curl', 'bar',
    [['Bíceps'], ['Braquial', 'Braquiorradial']],
    ['Agarre al ancho de los hombros',
     'Codos quietos a los costados',
     'Sube hasta contraer sin llevar los codos adelante',
     'Baja completo en 2-3 s'],
    ['Balancearte con la espalda', 'Codos que se van adelante', 'Bajar a medias'],
    '3-0-1', 75);
  X('curl_inclinado_manc', 'Curl inclinado con mancuernas', 'incline dumbbell curl', 'biceps', 'curl', 'db',
    [['Bíceps (cabeza larga)'], ['Braquial']],
    ['Banco a 45-60°, brazos colgando detrás del torso',
     'Palmas al frente',
     'Sube sin mover los codos',
     'Estira completo abajo: ahí está la gracia'],
    ['Adelantar los codos', 'Despegar los hombros', 'Peso alto que acorta el rango'],
    '3-0-1', 75, { inc: 1 });
  X('curl_predicador', 'Curl en banco Scott', 'preacher curl', 'biceps', 'curl', 'bar',
    [['Bíceps'], ['Braquial']],
    ['Axilas pegadas al borde del banco',
     'Baja hasta casi extender',
     'Sube sin despegar los brazos',
     'Controla abajo, que es la parte más exigente'],
    ['Rebotar abajo', 'Levantar los codos', 'Extender de golpe'],
    '3-0-1', 75);
  X('curl_polea', 'Curl en polea', 'cable curl', 'biceps', 'curl', 'cable',
    [['Bíceps'], ['Braquial']],
    ['Polea baja con barra o manija',
     'Codos fijos',
     'Aprieta arriba 1 s',
     'Baja lento'],
    ['Balanceo', 'Codos adelante', 'Rango corto'],
    '2-1-1', 60);

  X('curl_martillo', 'Curl martillo', 'hammer curl', 'biceps_b', 'curl', 'db',
    [['Braquial', 'Braquiorradial'], ['Bíceps']],
    ['Palmas enfrentadas todo el recorrido',
     'Codos quietos',
     'Sube hasta el hombro',
     'Alterna o ambos a la vez'],
    ['Balancearte', 'Girar las muñecas', 'Bajar sin control'],
    '2-0-1', 60, { inc: 1 });
  X('curl_martillo_cuerda', 'Curl martillo en polea con cuerda', 'rope hammer curl', 'biceps_b', 'curl', 'cable',
    [['Braquial', 'Braquiorradial'], ['Bíceps']],
    ['Polea baja con cuerda',
     'Codos pegados a los costados',
     'Sube hasta el pecho sin mover los codos',
     'Baja completo'],
    ['Echarte atrás', 'Codos adelante', 'Rango corto'],
    '2-1-1', 60);
  X('curl_invertido', 'Curl invertido con barra Z', 'reverse ez bar curl', 'biceps_b', 'curl', 'bar',
    [['Braquiorradial', 'Braquial'], ['Bíceps']],
    ['Agarre con palmas hacia abajo',
     'Codos fijos',
     'Sube controlado',
     'Muñecas rectas'],
    ['Doblar las muñecas', 'Balanceo', 'Peso alto'],
    '2-0-1', 60);

  /* ---------- PIERNAS ---------- */
  X('sentadilla', 'Sentadilla con barra', 'barbell back squat', 'sentadilla', 'squat', 'bar',
    [['Cuádriceps', 'Glúteo mayor'], ['Aductores', 'Erectores', 'Core']],
    ['Barra sobre los trapecios, pies al ancho de hombros y puntas un poco afuera',
     'Toma aire, aprieta el abdomen y baja con las rodillas en dirección de las puntas',
     'Baja hasta que la cadera quede a la altura de las rodillas o más, si tu movilidad lo permite',
     'Sube empujando el piso con todo el pie'],
    ['Rodillas que se van hacia adentro', 'Levantar los talones', 'Perder la tensión abajo y rebotar flojo'],
    '3-1-X', 180);
  X('sentadilla_hack', 'Sentadilla hack', 'hack squat', 'sentadilla', 'squat', 'machine',
    [['Cuádriceps'], ['Glúteo mayor', 'Aductores']],
    ['Espalda pegada al respaldo, pies a media plataforma',
     'Baja profundo y controlado',
     'Rodillas en dirección de las puntas',
     'Sube sin trabar'],
    ['Pies muy altos: le quita trabajo al cuádriceps', 'Despegar la cadera', 'Rango corto'],
    '3-0-1', 150, { inc: 5 });
  X('sentadilla_frontal', 'Sentadilla frontal', 'front squat', 'sentadilla', 'squat', 'bar',
    [['Cuádriceps'], ['Glúteo mayor', 'Core', 'Espalda alta']],
    ['Barra sobre los hombros delanteros, codos altos',
     'Torso más vertical que en la trasera',
     'Baja profundo',
     'Sube manteniendo los codos arriba'],
    ['Codos que se caen', 'Redondear la espalda alta', 'Talones arriba'],
    '3-0-X', 180);
  X('sentadilla_smith', 'Sentadilla en Smith', 'smith machine squat', 'sentadilla', 'squat', 'bar',
    [['Cuádriceps', 'Glúteo mayor'], ['Aductores']],
    ['Pies un poco adelante de la barra',
     'Baja controlado',
     'Rodillas en dirección de las puntas',
     'Sube empujando con todo el pie'],
    ['Pies muy atrás', 'Rebotar', 'Rango corto'],
    '3-0-1', 150);

  X('peso_muerto_rumano', 'Peso muerto rumano', 'romanian deadlift', 'bisagra', 'hinge', 'bar',
    [['Isquiotibiales', 'Glúteo mayor'], ['Erectores', 'Aductor mayor']],
    ['Rodillas un poco dobladas y fijas',
     'Lleva la cadera atrás, como cerrando una puerta con la cola',
     'Barra pegada a los muslos todo el tiempo',
     'Baja hasta sentir estiramiento fuerte en el femoral (suele ser a media tibia)'],
    ['Redondear la espalda baja', 'Doblar mucho las rodillas: se vuelve peso muerto', 'Barra lejos del cuerpo'],
    '3-1-1', 150);
  X('peso_muerto_rumano_manc', 'Peso muerto rumano con mancuernas', 'dumbbell romanian deadlift', 'bisagra', 'hinge', 'db',
    [['Isquiotibiales', 'Glúteo mayor'], ['Erectores']],
    ['Mancuernas frente a los muslos',
     'Cadera atrás con rodillas suaves',
     'Mancuernas cerca de las piernas',
     'Sube apretando el glúteo'],
    ['Redondear la espalda', 'Mancuernas lejos del cuerpo', 'Doblar mucho las rodillas'],
    '3-1-1', 120, { inc: 2 });
  X('buenos_dias', 'Buenos días con barra', 'barbell good morning', 'bisagra', 'goodmorning', 'bar',
    [['Isquiotibiales', 'Erectores'], ['Glúteo mayor']],
    ['Barra en la espalda como en la sentadilla',
     'Rodillas suaves',
     'Cadera atrás con la espalda neutra',
     'Sube apretando el glúteo'],
    ['Redondear la espalda', 'Bajar demasiado con peso alto', 'Rodillas muy dobladas'],
    '3-0-1', 120);
  X('hiperextension_45', 'Hiperextensión a 45°', '45 degree back extension', 'bisagra', 'hyper', 'bw',
    [['Glúteo mayor', 'Isquiotibiales'], ['Erectores']],
    ['Borde del cojín a la altura de la cadera',
     'Baja con la espalda neutra doblando la cadera',
     'Sube apretando glúteo hasta quedar en línea recta',
     'Puedes abrazar un disco para darle peso'],
    ['Arquear la lumbar arriba', 'Rebotar', 'Cojín demasiado alto'],
    '2-1-1', 75, { bw: true });

  X('peso_muerto', 'Peso muerto convencional', 'conventional deadlift', 'peso_muerto', 'deadlift', 'bar',
    [['Glúteo mayor', 'Isquiotibiales', 'Erectores'], ['Cuádriceps', 'Trapecio', 'Antebrazos']],
    ['Barra sobre la mitad del pie, espinillas cerca',
     'Agarre justo por fuera de las piernas, espalda neutra y dorsales apretados',
     'Empuja el piso con las piernas; la barra sube pegada al cuerpo',
     'Termina de pie con glúteo apretado, sin echarte atrás'],
    ['Redondear la espalda baja', 'Que la cadera suba antes que los hombros', 'Dar tirones: tensa la barra antes de subir'],
    '2-0-1', 180);
  X('peso_muerto_trap', 'Peso muerto con barra hexagonal', 'trap bar deadlift', 'peso_muerto', 'deadlift', 'bar',
    [['Cuádriceps', 'Glúteo mayor'], ['Isquiotibiales', 'Erectores', 'Trapecio']],
    ['Párate en el centro de la barra',
     'Usa las manijas altas si estás empezando',
     'Empuja el piso con todo el pie',
     'Espalda neutra de principio a fin'],
    ['Redondear la espalda', 'Rebotar los discos', 'Echarte atrás arriba'],
    '2-0-1', 180, { inc: 5 });
  X('peso_muerto_sumo', 'Peso muerto sumo', 'sumo deadlift', 'peso_muerto', 'deadlift', 'bar',
    [['Glúteo mayor', 'Cuádriceps', 'Aductores'], ['Isquiotibiales', 'Erectores']],
    ['Piernas abiertas, puntas hacia afuera',
     'Agarre por dentro de las piernas',
     'Empuja las rodillas hacia afuera',
     'Pecho arriba'],
    ['Cadera muy baja o muy alta', 'Rodillas hacia adentro', 'Redondear la espalda'],
    '2-0-1', 180);
  X('hip_thrust', 'Hip thrust con barra', 'barbell hip thrust', 'peso_muerto', 'hipthrust', 'bar',
    [['Glúteo mayor'], ['Isquiotibiales', 'Cuádriceps']],
    ['Espalda alta apoyada en el banco, barra sobre la cadera con almohadilla',
     'Pies al ancho de la cadera; arriba las espinillas quedan verticales',
     'Sube apretando el glúteo, barbilla recogida',
     'Pausa 1 s arriba'],
    ['Arquear la lumbar en vez de extender la cadera', 'Pies muy lejos o muy cerca', 'Rango corto'],
    '2-1-1', 120, { inc: 5 });

  X('prensa', 'Prensa de piernas', 'leg press', 'prensa', 'legpress', 'machine',
    [['Cuádriceps', 'Glúteo mayor'], ['Aductores']],
    ['Pies a media plataforma, al ancho de la cadera',
     'Baja hasta que las rodillas lleguen cerca del pecho sin que se levante la cola',
     'Empuja con todo el pie',
     'No bloquees las rodillas de golpe arriba'],
    ['Levantar la cadera del asiento abajo', 'Rodillas hacia adentro', 'Recorrido cortico con mucho peso'],
    '3-0-1', 120, { inc: 5 });
  X('sentadilla_pendulo', 'Sentadilla péndulo', 'pendulum squat', 'prensa', 'squat', 'machine',
    [['Cuádriceps'], ['Glúteo mayor']],
    ['Espalda pegada, hombros bajo las almohadillas',
     'Baja profundo',
     'Las rodillas pueden pasar las puntas sin problema',
     'Sube controlado'],
    ['Rango corto', 'Talones arriba', 'Rebotar'],
    '3-0-1', 120, { inc: 5 });
  X('sentadilla_goblet', 'Sentadilla goblet', 'goblet squat', 'prensa', 'squat', 'db',
    [['Cuádriceps', 'Glúteo mayor'], ['Core', 'Aductores']],
    ['Mancuerna pegada al pecho',
     'Abajo los codos quedan entre las rodillas',
     'Torso erguido',
     'Baja profundo'],
    ['Mancuerna lejos del pecho', 'Talones arriba', 'Rodillas hacia adentro'],
    '3-0-1', 90, { inc: 2 });

  X('sentadilla_bulgara', 'Sentadilla búlgara', 'bulgarian split squat', 'unilateral', 'lunge', 'db',
    [['Cuádriceps', 'Glúteo mayor'], ['Aductores']],
    ['Pie de atrás en un banco, pie de adelante a un paso largo',
     'Baja vertical, rodilla de atrás hacia el piso',
     'Torso inclinado = más glúteo; recto = más cuádriceps',
     'Empuja con el pie de adelante'],
    ['Pie delantero muy cerca del banco', 'Rodilla que se va hacia adentro', 'Perder el equilibrio: agárrate de algo si hace falta'],
    '3-0-1', 90, { inc: 2 });
  X('zancadas_caminando', 'Zancadas caminando', 'walking lunges', 'unilateral', 'lunge', 'db',
    [['Cuádriceps', 'Glúteo mayor'], ['Aductores', 'Isquiotibiales']],
    ['Pasos largos',
     'La rodilla de atrás casi toca el piso',
     'Torso firme',
     'Empuja con el talón de adelante'],
    ['Pasos cortos', 'Rodilla hacia adentro', 'Inclinarte demasiado'],
    '2-0-1', 90, { inc: 2 });
  X('step_up', 'Subida al cajón', 'dumbbell step up', 'unilateral', 'lunge', 'db',
    [['Cuádriceps', 'Glúteo mayor'], ['Isquiotibiales']],
    ['Cajón a la altura de la rodilla',
     'Todo el pie arriba',
     'Sube con la pierna de arriba, sin impulsarte con la de abajo',
     'Baja controlado'],
    ['Impulsarte con la pierna de abajo', 'Cajón demasiado alto', 'Rodilla hacia adentro'],
    '2-0-1', 90, { inc: 2 });

  X('extension_cuadriceps', 'Extensión de cuádriceps', 'leg extension', 'cuadriceps_ais', 'legext', 'machine',
    [['Cuádriceps'], []],
    ['Rodilla alineada con el eje de la máquina',
     'Rodillo sobre el tobillo',
     'Extiende y aprieta 1 s arriba',
     'Baja lento'],
    ['Levantar la cola del asiento', 'Patear rápido', 'Rango corto'],
    '2-1-1', 75);
  X('extension_unilateral', 'Extensión de cuádriceps a una pierna', 'single leg extension', 'cuadriceps_ais', 'legext', 'machine',
    [['Cuádriceps'], []],
    ['Misma máquina, una pierna a la vez',
     'Agárrate de las manijas',
     'Aprieta 1 s arriba',
     'Empieza por la pierna más débil'],
    ['Girar la cadera', 'Ir rápido', 'Rango corto'],
    '2-1-1', 60);
  X('sentadilla_sissy', 'Sentadilla sissy', 'sissy squat', 'cuadriceps_ais', 'squat', 'bw',
    [['Cuádriceps'], []],
    ['Agárrate de un soporte',
     'Talones arriba; las rodillas van adelante mientras te inclinas atrás',
     'Línea recta de rodillas a hombros',
     'Baja solo hasta donde controles'],
    ['Doblar la cadera: se vuelve sentadilla normal', 'Bajar demasiado rápido', 'Hacerla sin apoyo'],
    '3-0-1', 75, { bw: true });

  X('curl_femoral_tumbado', 'Curl femoral tumbado', 'lying leg curl', 'femoral', 'legcurl', 'machine',
    [['Isquiotibiales'], ['Gemelos']],
    ['Rodillas justo por fuera del borde del banco',
     'Cadera pegada al banco',
     'Dobla hasta casi tocar el glúteo',
     'Baja en 2-3 s'],
    ['Levantar la cadera', 'Balancearte', 'Rango corto'],
    '3-1-1', 75);
  X('curl_femoral_sentado', 'Curl femoral sentado', 'seated leg curl', 'femoral', 'legcurl', 'machine',
    [['Isquiotibiales'], ['Gemelos']],
    ['Rodilla alineada con el eje de la máquina',
     'Almohadilla bien trabada sobre los muslos',
     'Inclínate un poco adelante para estirar más el femoral',
     'Controla la subida'],
    ['Rango corto', 'Soltar el peso', 'Despegar los muslos'],
    '3-1-1', 75);
  X('curl_nordico', 'Curl nórdico', 'nordic hamstring curl', 'femoral', 'nordic', 'bw',
    [['Isquiotibiales'], ['Glúteo mayor']],
    ['Tobillos trabados, rodillas en colchoneta',
     'Cuerpo recto de rodillas a cabeza',
     'Bájate lo más lento que puedas',
     'Frena con las manos y empuja para volver'],
    ['Doblar la cadera', 'Caer sin control', 'Muchas reps al inicio: deja un dolor muscular fuerte'],
    '5-0-1', 120, { bw: true, reps: [4, 8] });
  X('curl_femoral_pie', 'Curl femoral de pie a una pierna', 'standing leg curl', 'femoral', 'legcurl', 'machine',
    [['Isquiotibiales'], ['Gemelos']],
    ['Rodilla alineada con el eje',
     'Cadera quieta contra el soporte',
     'Dobla hasta arriba y pausa 1 s',
     'Baja lento'],
    ['Mover la cadera', 'Rango corto', 'Ir rápido'],
    '2-1-1', 60);

  X('elev_talones_pie', 'Elevación de talones de pie', 'standing calf raise', 'gemelos', 'calf', 'machine',
    [['Gastrocnemio'], ['Sóleo']],
    ['Puntas en el borde del escalón',
     'Baja el talón hasta estirar y pausa 1-2 s abajo',
     'Sube lo más alto posible',
     'Rodillas extendidas'],
    ['Rebotar abajo', 'Rango corto', 'Doblar las rodillas para ayudarte'],
    '2-2-1', 60, { inc: 5 });
  X('elev_talones_sentado', 'Elevación de talones sentado', 'seated calf raise', 'gemelos', 'calf', 'machine',
    [['Sóleo'], ['Gastrocnemio']],
    ['Almohadilla sobre los muslos, cerca de las rodillas',
     'Estira abajo con pausa',
     'Sube al máximo',
     'Sin rebotes'],
    ['Rebotar', 'Rango corto', 'Ir rápido'],
    '2-2-1', 60, { inc: 5 });
  X('elev_talones_prensa', 'Gemelos en prensa', 'leg press calf raise', 'gemelos', 'calf', 'machine',
    [['Gastrocnemio'], ['Sóleo']],
    ['Solo las puntas en el borde de la plataforma',
     'Rodillas casi extendidas (sin trabar)',
     'Estira abajo con pausa',
     'Empuja con la punta hasta arriba'],
    ['Doblar las rodillas', 'Rebotar', 'Rango corto'],
    '2-2-1', 60, { inc: 5 });

  /* ---------- CORE ---------- */
  X('crunch_polea', 'Crunch en polea', 'cable crunch', 'core_flex', 'crunch', 'cable',
    [['Recto abdominal'], ['Oblicuos']],
    ['Arrodillado, cuerda a los lados de la cabeza',
     'Cadera quieta',
     'Enrolla la columna llevando el pecho hacia la pelvis',
     'Vuelve lento'],
    ['Mover la cadera: se vuelve bisagra', 'Tirar con los brazos', 'Peso excesivo'],
    '2-1-1', 60);
  X('rueda_abdominal', 'Rueda abdominal', 'ab wheel rollout', 'core_flex', 'wheel', 'bw',
    [['Recto abdominal'], ['Oblicuos', 'Dorsal ancho']],
    ['Rodillas en colchoneta, abdomen apretado y pelvis metida',
     'Rueda adelante hasta donde controles',
     'La espalda no se hunde',
     'Vuelve con el abdomen, no con la cadera'],
    ['Lumbar hundida', 'Ir más lejos de lo que controlas', 'Mover la cadera atrás primero'],
    '3-0-1', 75, { bw: true, reps: [8, 12] });
  X('crunch_declinado', 'Crunch en banco declinado', 'decline crunch', 'core_flex', 'crunchfloor', 'bw',
    [['Recto abdominal'], ['Oblicuos']],
    ['Pies trabados',
     'Enrolla la columna, no solo subas',
     'Puedes sostener un disco al pecho',
     'Baja controlado'],
    ['Tirar del cuello', 'Usar impulso', 'Arquear la espalda abajo'],
    '2-1-1', 60, { bw: true });

  X('elev_piernas_colgado', 'Elevación de piernas colgado', 'hanging leg raise', 'core_cadera', 'legraise', 'bw',
    [['Recto abdominal', 'Flexores de cadera'], ['Oblicuos']],
    ['Cuelga con los hombros activos',
     'Sube rodillas o piernas enrollando la pelvis hacia arriba',
     'Sin balanceo',
     'Baja en 2-3 s'],
    ['Balancearte', 'Subir solo las piernas sin enrollar la pelvis', 'Bajar de golpe'],
    '2-1-2', 60, { bw: true });
  X('elev_rodillas_paralelas', 'Elevación de rodillas en silla romana', 'captains chair knee raise', 'core_cadera', 'legraise', 'bw',
    [['Recto abdominal', 'Flexores de cadera'], ['Oblicuos']],
    ['Antebrazos apoyados, espalda contra el respaldo',
     'Sube las rodillas al pecho enrollando la pelvis',
     'Pausa 1 s arriba',
     'Baja controlado'],
    ['Balancear las piernas', 'Despegar la espalda', 'Bajar de golpe'],
    '2-1-2', 60, { bw: true });
  X('elev_piernas_suelo', 'Elevación de piernas acostado', 'lying leg raise', 'core_cadera', 'legraisefloor', 'bw',
    [['Recto abdominal', 'Flexores de cadera'], []],
    ['Lumbar pegada al piso',
     'Piernas casi rectas',
     'Sube hasta 90°',
     'Baja sin tocar el piso'],
    ['Arquear la lumbar', 'Usar impulso', 'Rango corto'],
    '2-0-2', 60, { bw: true });

  X('plancha', 'Plancha', 'plank', 'core_est', 'plank', 'bw',
    [['Recto abdominal', 'Transverso'], ['Oblicuos', 'Glúteo mayor']],
    ['Antebrazos debajo de los hombros',
     'Aprieta glúteo y abdomen como si te fueran a pegar',
     'Cuerpo en línea recta',
     'Respira normal'],
    ['Cadera caída', 'Cadera muy arriba', 'Aguantar la respiración'],
    'Isométrico', 60, { bw: true, unit: 'seg', reps: [30, 60] });
  X('pallof_press', 'Press Pallof', 'pallof press', 'core_est', 'pallof', 'cable',
    [['Oblicuos', 'Transverso'], ['Recto abdominal']],
    ['De lado a la polea, a la altura del pecho',
     'Pies al ancho de los hombros, abdomen firme',
     'Empuja la manija al frente sin dejar que te gire',
     'Aguanta 2 s y vuelve; haz ambos lados'],
    ['Girar el torso', 'Arquear la espalda', 'Peso excesivo'],
    '1-2-1', 60, { reps: [10, 12] });
  X('plancha_lateral', 'Plancha lateral', 'side plank', 'core_est', 'plank', 'bw',
    [['Oblicuos'], ['Transverso', 'Glúteo medio']],
    ['Antebrazo debajo del hombro',
     'Cadera arriba, cuerpo en línea recta',
     'Haz ambos lados',
     'Respira normal'],
    ['Cadera caída', 'Rotar el torso hacia el piso', 'Aguantar la respiración'],
    'Isométrico', 45, { bw: true, unit: 'seg', reps: [20, 45] });


  /* ---------- CALISTENIA (casa y parque) ---------- */
  const C = (id, n, en, g, pose, mus, c, e, t, r, o) => X(id, n, en, g, pose, 'bw', mus, c, e, t, r, Object.assign({ bw: true, cal: 1, inc: 2 }, o || {}));
  C('flexiones', 'Flexiones', 'push up', 'pecho_h', 'pushup',
    [['Pectoral mayor'], ['Tríceps', 'Deltoides anterior', 'Core']],
    ['Manos un poco más anchas que los hombros', 'Cuerpo recto de cabeza a talones, glúteo apretado', 'Baja hasta que el pecho casi toque el piso', 'Cuando hagas 20 limpias, pasa a declinadas o ponte una mochila con peso'],
    ['Cadera caída', 'Codos totalmente abiertos', 'Medias repeticiones'], '2-1-1', 90, { reps: [10, 20] });
  C('flexiones_declinadas', 'Flexiones declinadas (pies elevados)', 'decline push up', 'pecho_inc', 'pushup',
    [['Pectoral superior'], ['Deltoides anterior', 'Tríceps']],
    ['Pies sobre una silla, cama o banco', 'Manos al ancho de los hombros', 'Baja el pecho controlado hasta casi tocar el piso', 'Más alto los pies = más difícil y más hombro'],
    ['Cadera muy arriba', 'Arquear la lumbar', 'Rebotar abajo'], '2-1-1', 90, { reps: [8, 15] });
  C('flexiones_arquero', 'Flexiones arquero', 'archer push up', 'pecho_inc', 'pushup',
    [['Pectoral mayor'], ['Tríceps', 'Deltoides anterior']],
    ['Manos muy abiertas', 'Baja hacia un lado doblando ese brazo; el otro queda casi recto', 'Alterna lados', 'Es el paso previo a la flexión a un brazo'],
    ['Girar la cadera', 'Bajar poco', 'Ir rápido'], '2-1-1', 90, { reps: [5, 10] });
  C('flexiones_anchas', 'Flexiones con agarre ancho', 'wide push up', 'pecho_ais', 'pushup',
    [['Pectoral mayor'], ['Deltoides anterior']],
    ['Manos bastante más anchas que los hombros', 'Baja lento sintiendo el estiramiento del pecho', 'Aprieta el pecho al subir', 'Cuerpo recto'],
    ['Manos demasiado adelante', 'Cadera caída', 'Recorrido corto'], '3-1-1', 75, { reps: [10, 20] });
  C('flexiones_pica', 'Flexiones pica (pike push-up)', 'pike push up', 'hombro_v', 'pushup',
    [['Deltoides anterior'], ['Tríceps', 'Trapecio superior']],
    ['Forma una V invertida con la cadera arriba', 'Baja la cabeza hacia el piso entre las manos', 'Empuja hacia arriba y atrás', 'Pies en una silla = más difícil'],
    ['Bajar el pecho en vez de la cabeza', 'Codos muy abiertos', 'Cadera que baja'], '2-1-1', 90, { reps: [6, 12] });
  C('flexiones_diamante', 'Flexiones diamante', 'diamond push up', 'triceps', 'pushup',
    [['Tríceps'], ['Pectoral mayor', 'Deltoides anterior']],
    ['Manos juntas bajo el pecho formando un rombo', 'Codos pegados al cuerpo', 'Baja hasta tocar las manos con el pecho', 'Si cuesta mucho, apoya las rodillas'],
    ['Codos abiertos', 'Cadera caída', 'Muñecas adoloridas: abre un poco las manos'], '2-1-1', 75, { reps: [8, 15] });
  C('fondos_banco', 'Fondos en banco o silla', 'bench dips', 'triceps', 'dip',
    [['Tríceps'], ['Pectoral inferior', 'Deltoides anterior']],
    ['Manos en el borde de un banco o silla firme', 'Espalda pegada al borde', 'Baja hasta que los codos queden a 90°', 'Pies más lejos = más difícil'],
    ['Bajar demasiado (molesta el hombro)', 'Alejar la espalda del banco', 'Silla que se mueve'], '2-1-1', 75, { reps: [10, 20] });
  C('ext_triceps_corporal', 'Extensión de tríceps con peso corporal', 'bodyweight triceps extension', 'triceps_oh', 'ohext',
    [['Tríceps'], []],
    ['Manos en una barra baja, mesa o encimera firme', 'Cuerpo recto e inclinado', 'Dobla solo los codos llevando la frente hacia las manos', 'Empuja hasta estirar los brazos'],
    ['Mover los hombros', 'Cadera caída', 'Superficie que se resbala'], '3-0-1', 75, { reps: [8, 15] });
  C('elev_laterales_casa', 'Elevaciones laterales con botellas o mochila', 'lateral raise with water bottles', 'hombro_lat', 'lateral',
    [['Deltoides lateral'], ['Trapecio superior']],
    ['Usa botellas de agua o bolsas con peso en cada mano', 'Codos apenas doblados', 'Sube hasta la línea del hombro', 'Baja lento: con poco peso, el tiempo bajo tensión es lo que cuenta'],
    ['Balancearte', 'Encoger los hombros', 'Ir rápido'], '2-1-3', 60, { reps: [12, 25], inc: 1 });
  C('ytw_piso', 'Y-T-W boca abajo', 'prone Y T W raise', 'hombro_post', 'reversefly',
    [['Deltoides posterior'], ['Trapecio medio e inferior', 'Romboides']],
    ['Acostado boca abajo, frente cerca del piso', 'Sube los brazos en Y, luego en T, luego en W: eso es 1 rep', 'Pulgares hacia arriba', 'Pausa 1 s arriba en cada letra'],
    ['Levantar el pecho con la lumbar', 'Ir rápido', 'Encoger los hombros'], '1-1-1', 60, { reps: [8, 12] });
  C('remo_mesa', 'Remo invertido bajo una mesa', 'table inverted row', 'espalda_h', 'row',
    [['Dorsal ancho', 'Romboides'], ['Bíceps', 'Deltoides posterior']],
    ['Acuéstate bajo una mesa MUY firme y agarra el borde', 'Cuerpo recto, talones en el piso', 'Tira el pecho hacia la mesa juntando escápulas', 'Rodillas dobladas = más fácil'],
    ['Mesa que se voltea: pruébala antes', 'Cadera caída', 'Tirar con el cuello'], '2-1-2', 90, { reps: [8, 15] });
  C('remo_mochila', 'Remo con mochila', 'backpack bent over row', 'espalda_h', 'row',
    [['Dorsal ancho', 'Romboides'], ['Bíceps', 'Deltoides posterior']],
    ['Llena una mochila con libros o botellas', 'Bisagra de cadera, espalda plana', 'Tira la mochila hacia el ombligo', 'Pausa 1 s arriba'],
    ['Redondear la espalda', 'Tirar con impulso', 'Mochila que se balancea'], '2-1-2', 90, { reps: [10, 15] });
  C('remo_australiano', 'Remo australiano en barra baja', 'australian pull up', 'espalda_h', 'row',
    [['Dorsal ancho', 'Romboides', 'Trapecio medio'], ['Bíceps', 'Deltoides posterior']],
    ['Barra a la altura de la cintura', 'Cuerpo recto, talones en el piso', 'Lleva el pecho a la barra', 'Pies elevados = más difícil'],
    ['Cadera caída', 'Medias repeticiones', 'Encoger hombros'], '2-1-2', 90, { reps: [8, 15] });
  C('chin_ups', 'Dominadas supinas (chin-ups)', 'chin up', 'espalda_v', 'pullup',
    [['Dorsal ancho', 'Bíceps'], ['Braquial', 'Romboides']],
    ['Palmas hacia ti, al ancho de hombros', 'Arranca colgado con brazos estirados', 'Sube hasta pasar la barbilla', 'Baja en 2-3 s'],
    ['Balancearte', 'Medias repeticiones', 'Soltarte abajo de golpe'], '3-0-1', 120, { reps: [5, 10] });
  C('dominadas_negativas', 'Dominadas negativas', 'negative pull up', 'espalda_v', 'pullup',
    [['Dorsal ancho'], ['Bíceps', 'Romboides']],
    ['Sube saltando o con un banco hasta tener la barbilla sobre la barra', 'Baja lo más lento que puedas: 4-6 s', 'Vuelve a subir con ayuda', 'Sirve para ganar tus primeras dominadas'],
    ['Bajar rápido', 'Soltarte abajo', 'Hacer muchas: fatigan bastante'], '5-0-1', 120, { reps: [3, 6] });
  C('curl_mochila', 'Curl de bíceps con mochila', 'backpack biceps curl', 'biceps', 'curl',
    [['Bíceps'], ['Braquial']],
    ['Agarra la mochila cargada por las asas', 'Codos pegados al cuerpo', 'Sube y aprieta 1 s', 'Baja lento en 3 s'],
    ['Balancearte', 'Codos adelante', 'Bajar a medias'], '3-1-1', 60, { reps: [10, 15] });
  C('curl_mochila_martillo', 'Curl martillo con botellones', 'hammer curl with water jugs', 'biceps_b', 'curl',
    [['Braquial', 'Braquiorradial'], ['Bíceps']],
    ['Un botellón de agua o bolsa con peso en cada mano', 'Palmas enfrentadas', 'Codos quietos', 'Baja lento'],
    ['Balancearte', 'Girar las muñecas', 'Ir rápido'], '3-0-1', 60, { reps: [10, 20] });
  C('sentadilla_mochila', 'Sentadilla con mochila', 'backpack squat', 'sentadilla', 'squat',
    [['Cuádriceps', 'Glúteo mayor'], ['Aductores', 'Core']],
    ['Mochila cargada en la espalda o abrazada al pecho', 'Pies al ancho de hombros', 'Baja profundo con el torso firme', 'Sube empujando con todo el pie; sin mochila también vale'],
    ['Rodillas hacia adentro', 'Talones arriba', 'Recorrido corto'], '3-1-1', 90, { reps: [15, 25] });
  C('sentadilla_pistol_asistida', 'Sentadilla a una pierna asistida', 'assisted pistol squat', 'sentadilla', 'squat',
    [['Cuádriceps', 'Glúteo mayor'], ['Core']],
    ['Agárrate de una baranda, poste o marco de puerta', 'La otra pierna estirada al frente', 'Baja lo más profundo que controles', 'Usa cada vez menos ayuda de las manos'],
    ['Rodilla hacia adentro', 'Talón arriba', 'Caer abajo sin control'], '3-0-1', 90, { reps: [5, 10] });
  C('pmr_una_pierna', 'Peso muerto rumano a una pierna', 'single leg romanian deadlift', 'bisagra', 'hinge',
    [['Isquiotibiales', 'Glúteo mayor'], ['Core']],
    ['Mochila o botellón en la mano contraria a la pierna de apoyo', 'Rodilla de apoyo un poco doblada', 'Inclínate llevando la otra pierna atrás en línea con la espalda', 'Sube apretando el glúteo'],
    ['Girar la cadera', 'Redondear la espalda', 'Perder el equilibrio: apóyate con un dedo en la pared'], '3-1-1', 75, { reps: [10, 15] });
  C('puente_gluteo', 'Puente de glúteo', 'glute bridge', 'bisagra', 'hipthrust',
    [['Glúteo mayor'], ['Isquiotibiales']],
    ['Boca arriba, pies apoyados cerca de la cola', 'Sube la cadera apretando glúteos', 'Pausa 2 s arriba', 'Mochila sobre la cadera para hacerlo más duro'],
    ['Arquear la lumbar', 'Empujar con la punta de los pies', 'Ir rápido'], '2-2-1', 60, { reps: [15, 25] });
  C('hip_thrust_una_pierna', 'Hip thrust a una pierna', 'single leg hip thrust', 'peso_muerto', 'hipthrust',
    [['Glúteo mayor'], ['Isquiotibiales']],
    ['Espalda alta apoyada en sofá, cama o banco', 'Una pierna en el piso, la otra arriba', 'Sube la cadera hasta quedar en línea', 'Pausa 1 s arriba'],
    ['Arquear la lumbar', 'Girar la cadera', 'Rango corto'], '2-1-1', 75, { reps: [10, 15] });
  C('sentadilla_pared', 'Sentadilla isométrica en pared', 'wall sit', 'cuadriceps_ais', 'squat',
    [['Cuádriceps'], ['Glúteo mayor']],
    ['Espalda contra la pared', 'Baja hasta que los muslos queden paralelos al piso', 'Rodillas sobre los tobillos', 'Aguanta respirando normal'],
    ['Subir la cadera cuando cansa', 'Rodillas hacia adentro', 'Aguantar la respiración'], 'Isométrico', 60, { unit: 'seg', reps: [30, 60] });
  C('curl_deslizante', 'Curl femoral deslizante', 'sliding leg curl', 'femoral', 'legcurl',
    [['Isquiotibiales'], ['Glúteo mayor']],
    ['Boca arriba, talones sobre una toalla en piso liso', 'Sube la cadera en puente', 'Estira las piernas deslizando y vuelve a doblarlas sin bajar la cadera', 'A una pierna para hacerlo más duro'],
    ['Bajar la cadera', 'Ir rápido al estirar', 'Piso que no desliza'], '3-0-1', 75, { reps: [8, 15] });
  C('elev_talones_una_pierna', 'Elevación de talones a una pierna', 'single leg calf raise', 'gemelos', 'calf',
    [['Gastrocnemio'], ['Sóleo']],
    ['Punta de un pie en el borde de un escalón', 'Apóyate con la mano en la pared', 'Baja el talón con pausa abajo', 'Sube al máximo'],
    ['Rebotar', 'Doblar la rodilla', 'Rango corto'], '2-2-1', 45, { reps: [12, 20] });
  C('crunch_suelo', 'Crunch en el piso', 'crunch', 'core_flex', 'crunchfloor',
    [['Recto abdominal'], ['Oblicuos']],
    ['Boca arriba, rodillas dobladas', 'Enrolla la columna despegando los hombros', 'Exhala al subir', 'Baja controlado'],
    ['Tirar del cuello', 'Usar impulso', 'Subir con la cadera'], '2-1-1', 45, { reps: [15, 25] });
  C('escaladores', 'Escaladores (mountain climbers)', 'mountain climbers', 'core_flex', 'plank',
    [['Recto abdominal', 'Flexores de cadera'], ['Hombros']],
    ['Posición de flexión con brazos estirados', 'Lleva una rodilla al pecho y cambia', 'Cadera baja y estable', 'Ritmo constante'],
    ['Cadera muy arriba', 'Hombros detrás de las manos', 'Rebotar'], 'Continuo', 45, { unit: 'seg', reps: [30, 45] });


  // Ejercicios propios del parque de barras
  C('fondos_pecho', 'Fondos en paralelas (pecho)', 'chest dips', 'pecho_h', 'dip',
    [['Pectoral mayor', 'Pectoral inferior'], ['Tríceps', 'Deltoides anterior']],
    ['Inclina el torso adelante unos 30°', 'Codos un poco abiertos', 'Baja hasta sentir estiramiento en el pecho', 'Mochila con peso cuando pases de 15'],
    ['Bajar demasiado si molesta el hombro', 'Encoger los hombros', 'Balancear las piernas'], '2-1-1', 120, { reps: [6, 15] });
  C('flexiones_profundas_paralelas', 'Flexiones profundas en paralelas bajas', 'deep parallette push up', 'pecho_inc', 'pushup',
    [['Pectoral mayor'], ['Deltoides anterior', 'Tríceps']],
    ['Manos en las paralelas bajas del parque', 'Baja el pecho por debajo del nivel de las manos', 'Pies en un banco para cargar más la parte alta del pecho', 'Sube completo'],
    ['Quedarte corto arriba de las barras', 'Cadera caída', 'Codos totalmente abiertos'], '3-1-1', 90, { reps: [8, 15] });
  C('flexiones_pica_elevadas', 'Flexiones pica con pies en el banco', 'elevated pike push up', 'hombro_v', 'pushup',
    [['Deltoides anterior'], ['Tríceps', 'Trapecio superior']],
    ['Pies en un banco, manos en el piso o en paralelas bajas', 'Cadera arriba, torso casi vertical', 'Baja la cabeza entre las manos', 'Es el paso previo a la flexión en pino'],
    ['Bajar el pecho en vez de la cabeza', 'Codos muy abiertos', 'Perder la cadera arriba'], '2-1-1', 120, { reps: [5, 10] });
  C('curl_barra_corporal', 'Curl de bíceps colgado en barra baja', 'bodyweight bar biceps curl', 'biceps', 'curl',
    [['Bíceps'], ['Braquial']],
    ['Agarre supino en una barra a la altura de la cintura', 'Cuerpo recto e inclinado hacia atrás', 'Dobla solo los codos llevando la frente a la barra', 'Más horizontal = más difícil'],
    ['Tirar con la espalda', 'Cadera caída', 'Codos que se mueven'], '2-1-2', 75, { reps: [8, 15] });
  C('face_pull_australiano', 'Face pull en barra baja', 'bodyweight face pull', 'hombro_post', 'row',
    [['Deltoides posterior'], ['Trapecio medio', 'Romboides', 'Manguito rotador']],
    ['Agarre prono y cerrado en barra baja', 'Cuerpo recto inclinado atrás', 'Lleva la barra hacia la frente con codos altos y abiertos', 'Pausa 1 s'],
    ['Codos abajo: se vuelve remo', 'Cadera caída', 'Ir rápido'], '2-1-2', 60, { reps: [10, 15] });
  C('sentadilla_salto', 'Sentadilla con salto', 'jump squat', 'sentadilla', 'squat',
    [['Cuádriceps', 'Glúteo mayor'], ['Gemelos']],
    ['Baja a media sentadilla con el pecho arriba', 'Salta explosivo', 'Cae suave, rodillas en dirección de las puntas', 'Enlaza la siguiente sin pausa larga'],
    ['Caer con las rodillas hacia adentro', 'Caer con las piernas rectas', 'Perder la técnica por cansancio'], 'Explosivo', 90, { reps: [10, 15] });
  C('l_sit_paralelas', 'L-sit en paralelas', 'parallel bar l sit', 'core_est', 'legraise',
    [['Recto abdominal', 'Flexores de cadera'], ['Tríceps', 'Cuádriceps']],
    ['Sube en las paralelas con brazos estirados y hombros abajo', 'Levanta las piernas rectas hasta formar una L', 'Si cuesta, dobla las rodillas', 'Aguanta respirando'],
    ['Encoger los hombros', 'Piernas que caen', 'Doblar los codos'], 'Isométrico', 75, { unit: 'seg', reps: [10, 30] });

  C('pullover_mochila', 'Pullover con mochila', 'backpack pullover', 'espalda_v', 'bench',
    [['Dorsal ancho'], ['Pectoral mayor', 'Tríceps (cabeza larga)']],
    ['Acostado en el piso o en la cama, mochila cargada con ambas manos sobre el pecho', 'Brazos casi rectos', 'Llévala por detrás de la cabeza hasta sentir el estiramiento del dorsal', 'Vuelve apretando la espalda'],
    ['Doblar mucho los codos', 'Arquear la lumbar', 'Bajar más de lo que controlas'], '3-1-1', 75, { reps: [10, 15] });

  // Equivalentes por lugar: mismo grupo muscular, lo que se puede hacer ahí
  const LOC = {
    casa: {
      pecho_h: ['flexiones', 'flexiones_anchas'], pecho_inc: ['flexiones_declinadas', 'flexiones_arquero'], pecho_ais: ['flexiones_anchas', 'flexiones_arquero'],
      hombro_v: ['flexiones_pica'], hombro_lat: ['elev_laterales_casa'], hombro_post: ['ytw_piso'],
      triceps: ['fondos_banco', 'flexiones_diamante'], triceps_oh: ['flexiones_diamante', 'fondos_banco'],
      espalda_v: ['remo_mesa', 'pullover_mochila', 'remo_mochila'], espalda_h: ['remo_mochila', 'remo_mesa'],
      biceps: ['curl_mochila'], biceps_b: ['curl_mochila_martillo'],
      sentadilla: ['sentadilla_mochila', 'sentadilla_pistol_asistida'], prensa: ['zancadas_caminando', 'sentadilla_mochila'],
      unilateral: ['sentadilla_bulgara', 'zancadas_caminando'], cuadriceps_ais: ['sentadilla_pared', 'sentadilla_sissy'],
      bisagra: ['pmr_una_pierna', 'puente_gluteo'], peso_muerto: ['puente_gluteo', 'hip_thrust_una_pierna'],
      femoral: ['curl_deslizante', 'curl_nordico'], gemelos: ['elev_talones_una_pierna'],
      core_flex: ['crunch_suelo', 'escaladores'], core_cadera: ['elev_piernas_suelo'], core_est: ['plancha', 'plancha_lateral']
    },
    parque: {
      pecho_h: ['fondos_pecho', 'flexiones'], pecho_inc: ['flexiones_profundas_paralelas', 'flexiones_declinadas'], pecho_ais: ['flexiones', 'flexiones_arquero'],
      hombro_v: ['flexiones_pica_elevadas', 'flexiones_pica'], hombro_lat: ['elev_laterales_casa'], hombro_post: ['face_pull_australiano', 'ytw_piso'],
      triceps: ['ext_triceps_corporal', 'fondos'], triceps_oh: ['ext_triceps_corporal', 'flexiones_diamante'],
      espalda_v: ['dominadas', 'chin_ups', 'dominadas_negativas'], espalda_h: ['remo_australiano', 'face_pull_australiano'],
      biceps: ['curl_barra_corporal', 'chin_ups'], biceps_b: ['chin_ups', 'curl_barra_corporal', 'curl_mochila_martillo'],
      sentadilla: ['sentadilla_pistol_asistida', 'sentadilla_salto'], prensa: ['sentadilla_salto', 'step_up'],
      unilateral: ['step_up', 'sentadilla_bulgara'], cuadriceps_ais: ['sentadilla_sissy', 'sentadilla_salto'],
      bisagra: ['hip_thrust_una_pierna', 'pmr_una_pierna'], peso_muerto: ['pmr_una_pierna', 'hip_thrust_una_pierna'],
      femoral: ['curl_nordico', 'curl_deslizante'], gemelos: ['elev_talones_una_pierna'],
      core_flex: ['elev_rodillas_paralelas', 'escaladores'], core_cadera: ['elev_piernas_colgado', 'elev_rodillas_paralelas'], core_est: ['l_sit_paralelas', 'plancha_lateral']
    }
  };
  // Ejercicios con peso corporal que sirven fuera del gimnasio (aparte de los nuevos)
  ['zancadas_caminando', 'step_up', 'sentadilla_bulgara', 'sentadilla_sissy', 'curl_nordico', 'elev_piernas_suelo', 'plancha', 'plancha_lateral', 'fondos', 'dominadas', 'elev_piernas_colgado', 'elev_rodillas_paralelas'].forEach(id => { E[id].out = 1; });

  // Fotos inicio/final (free-exercise-db, dominio público): img/ex/<id>_0.jpg y _1.jpg
  ["aperturas_manc","aperturas_polea","buenos_dias","chin_ups","crunch_declinado","crunch_polea","crunch_suelo","curl_barra","curl_deslizante","curl_femoral_pie","curl_femoral_sentado","curl_femoral_tumbado","curl_inclinado_manc","curl_invertido","curl_martillo","curl_martillo_cuerda","curl_mochila","curl_mochila_martillo","curl_nordico","curl_polea","curl_predicador","dominadas","dominadas_asistidas","dominadas_negativas","elev_laterales_casa","elev_laterales_manc","elev_laterales_polea","elev_piernas_colgado","elev_piernas_suelo","elev_rodillas_paralelas","elev_talones_pie","elev_talones_prensa","elev_talones_sentado","elev_talones_una_pierna","escaladores","extension_cuadriceps","extension_unilateral","ext_sobre_cabeza_manc","ext_triceps_corporal","ext_triceps_polea","ext_triceps_sobre_cabeza","ext_triceps_una_mano","face_pull","face_pull_australiano","flexiones","flexiones_anchas","flexiones_declinadas","flexiones_diamante","flexiones_lastre","fondos","fondos_banco","fondos_pecho","hiperextension_45","hip_thrust","hip_thrust_una_pierna","jalon_neutro","jalon_pecho","pajaros_manc","pallof_press","pec_deck","peso_muerto","peso_muerto_rumano","peso_muerto_rumano_manc","peso_muerto_sumo","peso_muerto_trap","plancha","plancha_lateral","pmr_una_pierna","prensa","press_banca","press_banca_manc","press_cerrado","press_frances","press_hombro_manc","press_hombro_maquina","press_inclinado_barra","press_inclinado_manc","press_inclinado_maquina","press_inclinado_smith","press_maquina_pecho","press_militar","puente_gluteo","pullover_mochila","remo_australiano","remo_barra","remo_mancuerna","remo_mesa","remo_mochila","remo_pecho_apoyado","remo_polea_sentado","reverse_pec_deck","rueda_abdominal","sentadilla","sentadilla_bulgara","sentadilla_frontal","sentadilla_goblet","sentadilla_hack","sentadilla_mochila","sentadilla_pistol_asistida","sentadilla_salto","sentadilla_sissy","sentadilla_smith","step_up","ytw_piso","zancadas_caminando"].forEach(id => { if (E[id]) E[id].img = 1; });

  // Grupos: el orden define alternativas y rotación
  const G = {};
  Object.values(E).forEach(x => { (G[x.g] = G[x.g] || []).push(x.id); });

  // Rutinas. b = básico (se mantiene y progresa); sin b = accesorio (rota cada bloque)
  const R = {
    empuje: { n: 'Empuje', d: 'Pecho, hombro y tríceps', slots: [
      { id: 'e1', ex: 'press_banca', sets: 4, reps: [6, 8], b: 1 },
      { id: 'e2', ex: 'press_inclinado_manc', sets: 3, reps: [8, 12] },
      { id: 'e3', ex: 'press_militar', sets: 3, reps: [6, 8], b: 1 },
      { id: 'e4', ex: 'elev_laterales_manc', sets: 4, reps: [12, 15] },
      { id: 'e5', ex: 'aperturas_polea', sets: 3, reps: [12, 15] },
      { id: 'e6', ex: 'ext_triceps_polea', sets: 3, reps: [10, 15] }] },
    tiron: { n: 'Tirón', d: 'Espalda y bíceps', slots: [
      { id: 't1', ex: 'dominadas', sets: 4, reps: [6, 10], b: 1 },
      { id: 't2', ex: 'remo_barra', sets: 4, reps: [6, 8], b: 1 },
      { id: 't3', ex: 'jalon_neutro', sets: 3, reps: [10, 12] },
      { id: 't4', ex: 'face_pull', sets: 3, reps: [12, 15] },
      { id: 't5', ex: 'curl_barra', sets: 3, reps: [8, 12] },
      { id: 't6', ex: 'curl_martillo', sets: 3, reps: [10, 12] }] },
    piernas: { n: 'Piernas', d: 'Cuádriceps, femoral y gemelos', slots: [
      { id: 'p1', ex: 'sentadilla', sets: 4, reps: [5, 8], b: 1 },
      { id: 'p2', ex: 'peso_muerto_rumano', sets: 3, reps: [6, 10], b: 1 },
      { id: 'p3', ex: 'prensa', sets: 3, reps: [10, 12] },
      { id: 'p4', ex: 'curl_femoral_tumbado', sets: 3, reps: [10, 15] },
      { id: 'p5', ex: 'elev_talones_pie', sets: 4, reps: [10, 15] }] },
    torso: { n: 'Torso', d: 'Pecho, espalda y brazos', slots: [
      { id: 'o1', ex: 'press_inclinado_barra', sets: 4, reps: [6, 8], b: 1 },
      { id: 'o2', ex: 'remo_pecho_apoyado', sets: 3, reps: [8, 12] },
      { id: 'o3', ex: 'press_banca_manc', sets: 3, reps: [8, 12] },
      { id: 'o4', ex: 'jalon_pecho', sets: 3, reps: [8, 12] },
      { id: 'o5', ex: 'elev_laterales_polea', sets: 3, reps: [12, 15] },
      { id: 'o6', ex: 'curl_inclinado_manc', sets: 3, reps: [10, 12] },
      { id: 'o7', ex: 'ext_triceps_sobre_cabeza', sets: 3, reps: [10, 15] }] },
    pierna_core: { n: 'Piernas + core', d: 'Cadena posterior, cuádriceps y abdomen', slots: [
      { id: 'c1', ex: 'peso_muerto', sets: 3, reps: [4, 6], b: 1 },
      { id: 'c2', ex: 'sentadilla_bulgara', sets: 3, reps: [8, 12] },
      { id: 'c3', ex: 'extension_cuadriceps', sets: 3, reps: [12, 15] },
      { id: 'c4', ex: 'curl_femoral_sentado', sets: 3, reps: [10, 15] },
      { id: 'c5', ex: 'elev_piernas_colgado', sets: 3, reps: [10, 15] },
      { id: 'c6', ex: 'crunch_polea', sets: 3, reps: [12, 15] },
      { id: 'c7', ex: 'plancha', sets: 3, reps: [30, 60] }] }
  };

  const MUSCLE_ICON = { empuje: 'push', tiron: 'pull', piernas: 'legs', torso: 'upper', pierna_core: 'core' };

  window.PF_DATA = { E, G, R, LOC, MUSCLE_ICON };
})();
