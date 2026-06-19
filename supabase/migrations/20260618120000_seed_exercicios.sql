-- Seed: biblioteca inicial de exercícios com GIFs do ExerciseDB.
-- Idempotente: ON CONFLICT (nome) DO UPDATE corrige registros existentes (inclui o GIF errado do Supino).
-- GIF URLs seguem o formato https://v2.exercisedb.io/image/[id] (IDs numéricos do dataset público ExerciseDB).

-- Unique index necessário para o ON CONFLICT (nome) funcionar como constraint target.
CREATE UNIQUE INDEX IF NOT EXISTS exercicios_nome_unique ON public.exercicios (nome);

INSERT INTO public.exercicios (nome, grupo_muscular, equipamento, nivel, tipo_midia, gif_url, descricao) VALUES

-- ── PEITO ─────────────────────────────────────────────────────────────────────
('Supino com barra',
 'Peito', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0026',
 'Exercício composto principal para o peitoral maior. Deite no banco, desça a barra até o peito e empurre até a extensão total.'),

('Supino inclinado com halteres',
 'Peito', 'Halter', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0347',
 'Ênfase na porção superior do peitoral. Banco inclinado a 30–45°, halteres descem na linha dos ombros.'),

('Supino declinado com barra',
 'Peito', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0032',
 'Trabalha a porção inferior do peitoral. Banco declinado, pegada um pouco mais larga que os ombros.'),

('Crucifixo reto com halteres',
 'Peito', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0299',
 'Isolamento do peitoral. Braços semi-estendidos, halteres descem em arco até sentir o alongamento no peito.'),

('Crucifixo na polia',
 'Peito', 'Cabo', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0190',
 'Crossover com cabo mantém tensão constante no peitoral em todo o arco de movimento.'),

('Flexão de braço',
 'Peito', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0557',
 'Clássico exercício de peso corporal para peito e tríceps. Corpo reto, cotovelos a 45° do tronco.'),

('Crossover na polia alta',
 'Peito', 'Cabo', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0232',
 'Polia alta, traz os cabos em diagonal para baixo cruzando na frente do corpo. Ênfase na porção inferior do peito.'),

('Pullover com halter',
 'Peito', 'Halter', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0312',
 'Deitado no banco transversal, leva o halter em arco atrás da cabeça. Trabalha peito e grande dorsal.'),

-- ── COSTAS ────────────────────────────────────────────────────────────────────
('Puxada frontal',
 'Costas', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0630',
 'Puxar a barra até a frente do peito, cotovelos apontando para baixo. Base para desenvolver o grande dorsal.'),

('Remada curvada com barra',
 'Costas', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0028',
 'Tronco inclinado a ~45°, puxa a barra em direção ao abdômen. Exercício composto chave para espessura das costas.'),

('Remada unilateral com halter',
 'Costas', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0389',
 'Apoio no banco, puxa o halter em linha reta até o quadril. Excelente para corrigir assimetrias.'),

('Barra fixa',
 'Costas', 'Peso corporal', 'avancado', 'gif',
 'https://v2.exercisedb.io/image/0651',
 'Pull-up com peso corporal. Pegada pronada (palmas para frente), sobe até o queixo ultrapassar a barra.'),

('Remada na polia baixa',
 'Costas', 'Cabo', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0197',
 'Sentado, puxa o cabo com pegada neutra em direção ao abdômen. Mantém a coluna ereta durante todo o movimento.'),

('Levantamento terra',
 'Costas', 'Barra', 'avancado', 'gif',
 'https://v2.exercisedb.io/image/0139',
 'Exercício composto total. Barra saindo do chão até a extensão completa do quadril. Exige técnica precisa.'),

('Puxada neutra fechada',
 'Costas', 'Cabo', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0633',
 'Puxada com triângulo (pegada neutra). Menos tensão nos bíceps, mais ativação do grande dorsal.'),

('Hiperextensão lombar',
 'Costas', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0601',
 'No banco romano, eleva o tronco contraindo os eretores da espinha. Fortalece a lombar e protege contra lesões.'),

-- ── PERNAS ────────────────────────────────────────────────────────────────────
('Agachamento livre',
 'Pernas', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0138',
 'Rei dos exercícios. Barra nas costas, desce até as coxas ficarem paralelas ao chão, joelhos alinhados com os pés.'),

('Leg press',
 'Pernas', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0698',
 'Pés na plataforma a 90°, empurra afastando os joelhos. Opção mais segura para quem tem limitação lombar.'),

('Cadeira extensora',
 'Pernas', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0702',
 'Extensão de joelho para isolamento do quadríceps. Controle a fase excêntrica (descida) para maior ganho.'),

('Mesa flexora deitado',
 'Pernas', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0700',
 'Flexão de joelho deitado para isolar os isquiotibiais. Mantenha o quadril em contato com o banco.'),

('Avanço com halteres',
 'Pernas', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0677',
 'Passada à frente, joelho traseiro quase toca o chão. Trabalha quadríceps, glúteos e equilíbrio.'),

('Stiff com barra',
 'Pernas', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0168',
 'Levantamento terra romeno. Joelhos levemente dobrados, inclina o tronco mantendo a barra próxima ao corpo. Isquiotibiais e glúteos.'),

('Agachamento búlgaro',
 'Pernas', 'Halter', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/1764',
 'Pé traseiro elevado no banco. Exige mobilidade e equilíbrio. Alto recrutamento de glúteo e quadríceps.'),

('Panturrilha em pé na máquina',
 'Pernas', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/1384',
 'Elevação unilateral ou bilateral do calcanhar. Contrai no topo e desce com controle para alongar o gastrocnêmio.'),

('Panturrilha sentado',
 'Pernas', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/1386',
 'Com o joelho dobrado a 90°, foca no sóleo. Complementar à versão em pé para panturrilha completa.'),

('Adução de quadril na máquina',
 'Pernas', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0693',
 'Fecha as pernas contra a resistência da máquina. Trabalha os adutores e a face interna da coxa.'),

-- ── OMBRO ─────────────────────────────────────────────────────────────────────
('Desenvolvimento com halteres',
 'Ombro', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0368',
 'Sentado ou em pé, empurra os halteres acima da cabeça até extensão total. Deltoides anterior e médio.'),

('Desenvolvimento militar com barra',
 'Ombro', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0173',
 'Barra na frente do rosto, sobe à extensão total. Exercício composto principal para ombros.'),

('Elevação lateral com halteres',
 'Ombro', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0360',
 'Eleva os halteres lateralmente até a altura dos ombros. Isolamento do deltoide médio — cria largura.'),

('Elevação frontal com halteres',
 'Ombro', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0342',
 'Halteres à frente até a altura dos ombros. Foca no deltoide anterior. Pode alternar os braços.'),

('Encolhimento de ombros',
 'Ombro', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0418',
 'Eleva os ombros em direção às orelhas e desce com controle. Isola o trapézio superior.'),

('Elevação posterior com halteres',
 'Ombro', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0371',
 'Tronco inclinado, eleva os halteres lateralmente para trás. Deltoide posterior e manguito rotador.'),

-- ── BÍCEPS ────────────────────────────────────────────────────────────────────
('Rosca direta com barra',
 'Bíceps', 'Barra', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0085',
 'Movimento clássico de flexão de cotovelo com barra. Cotovelos fixos ao lado do tronco durante todo o movimento.'),

('Rosca alternada com halteres',
 'Bíceps', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0290',
 'Um braço de cada vez com supinação no topo. Permite maior amplitude e contração do bíceps braquial.'),

('Rosca concentrada',
 'Bíceps', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0303',
 'Cotovelo apoiado na face interna da coxa, cotovelo fixo. Máximo isolamento e pico de contração do bíceps.'),

('Rosca na polia',
 'Bíceps', 'Cabo', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0200',
 'Tensão constante em todo o movimento. Polia baixa com barra reta ou corda, cotovelos fixos.'),

('Rosca martelo',
 'Bíceps', 'Halter', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0326',
 'Pegada neutra (palmas voltadas uma para a outra). Trabalha o braquial e braquiorradial além do bíceps.'),

-- ── TRÍCEPS ───────────────────────────────────────────────────────────────────
('Tríceps na polia',
 'Tríceps', 'Cabo', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0221',
 'Puxada na polia alta com barra ou corda. Cotovelos fixos ao lado do corpo, extensão completa do cotovelo.'),

('Tríceps francês com halter',
 'Tríceps', 'Halter', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0323',
 'Deitado, abaixa o halter atrás da cabeça flexionando o cotovelo. Foco na porção longa do tríceps.'),

('Mergulho entre bancos',
 'Tríceps', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0566',
 'Mãos no banco atrás, desce o corpo flexionando os cotovelos. Joelhos estendidos para maior dificuldade.'),

('Tríceps testa com barra',
 'Tríceps', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0094',
 'Skull crusher. Deitado, desce a barra até a testa flexionando os cotovelos. Ótimo para massa do tríceps.'),

('Extensão de tríceps acima da cabeça',
 'Tríceps', 'Cabo', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0325',
 'Cabo atrás da cabeça, cotovelos apontam para cima. Trabalha a porção longa do tríceps em maior amplitude.'),

-- ── CORE ──────────────────────────────────────────────────────────────────────
('Prancha',
 'Core', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0571',
 'Apoio nos antebraços e pontas dos pés, corpo reto. Contrai abdômen, glúteos e quadríceps. Progride pelo tempo.'),

('Abdominal crunch',
 'Core', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0003',
 'Flexão de tronco parcial, mãos na têmpora. Sobe contraindo o reto abdominal, desce com controle.'),

('Abdominal bicicleta',
 'Core', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0006',
 'Cotovelo em direção ao joelho oposto alternando os lados. Trabalha reto e oblíquos simultaneamente.'),

('Elevação de pernas suspenso',
 'Core', 'Peso corporal', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0559',
 'Suspenso na barra, eleva as pernas até 90° sem balanço. Forte ativação do abdômen inferior e flexores do quadril.'),

('Russian twist',
 'Core', 'Peso corporal', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0704',
 'Sentado com tronco inclinado, gira o tronco de lado a lado. Pode segurar halter ou medicine ball.'),

('Abdominal roda',
 'Core', 'Peso corporal', 'avancado', 'gif',
 'https://v2.exercisedb.io/image/0008',
 'Com a roda abdominal, estende o corpo em direção ao chão e volta. Exige controle total do core.'),

-- ── GLÚTEO ────────────────────────────────────────────────────────────────────
('Hip thrust com barra',
 'Glúteo', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/1460',
 'Costas no banco, barra no quadril. Empurra o quadril para cima até extensão total. Máxima ativação do glúteo máximo.'),

('Glúteo 4 apoios',
 'Glúteo', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0615',
 'De quatro apoios, chuta o calcanhar para cima mantendo o joelho dobrado. Donkey kick com ênfase no glúteo máximo.'),

('Abdução de quadril na máquina',
 'Glúteo', 'Máquina', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0694',
 'Abre as pernas contra a resistência. Foca no glúteo médio e mínimo — essencial para estabilidade pélvica.'),

('Ponte de glúteos',
 'Glúteo', 'Peso corporal', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0802',
 'Deitado, pés apoiados no chão, eleva o quadril contraindo os glúteos no topo. Versão inicial do hip thrust.'),

('Afundo com barra',
 'Glúteo', 'Barra', 'intermediario', 'gif',
 'https://v2.exercisedb.io/image/0110',
 'Barra nas costas, passada longa à frente. Joelho traseiro quase toca o chão. Glúteos, quadríceps e equilíbrio.'),

('Coice de glúteo no cabo',
 'Glúteo', 'Cabo', 'iniciante', 'gif',
 'https://v2.exercisedb.io/image/0217',
 'Tornozeleira no cabo baixo, chuta a perna para trás até a extensão do quadril. Isolamento do glúteo máximo.')

ON CONFLICT (nome) DO UPDATE SET
  grupo_muscular  = EXCLUDED.grupo_muscular,
  equipamento     = EXCLUDED.equipamento,
  nivel           = EXCLUDED.nivel,
  tipo_midia      = EXCLUDED.tipo_midia,
  gif_url         = EXCLUDED.gif_url,
  descricao       = EXCLUDED.descricao;
