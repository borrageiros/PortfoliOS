export type Locale = 'es' | 'en';

export const translations = {
	en: {
		system: {
			loading: 'Starting...'
		},
		folder: {
			search: 'Search',
			quickAccess: 'Quick access',
			thisPC: 'This PC'
		},
		login: {
			title: 'Portfolio',
			subtitle: 'Choose a profile to continue',
			users: {
				recruiter: 'Recruiter',
				developer: 'Developer',
				stalker: 'Stalker',
				adventurer: 'Adventurer'
			},
			welcomeMessage: 'Welcome, {user}'
		},
		mobile: {
			desktopRecommendation: {
				title: 'Desktop Experience',
				message: 'This website is designed to provide a better experience on desktop devices.',
				continueMobile: 'Continue on Mobile'
			},
			preferences: {
				title: 'Preferences',
				language: 'Language',
				english: 'English',
				spanish: 'Spanish',
				theme: 'Theme',
				light: 'Light',
				dark: 'Dark',
				continue: 'Continue'
			}
		},
		taskbar: {
			search: 'Search',
			language: 'Language',
			theme: 'Toggle theme'
		},
		window: {
			minimize: 'Minimize',
			maximize: 'Maximize',
			restore: 'Restore',
			close: 'Close',
			resize: 'Resize'
		},
		profile: {
			title: 'Profile',
			information: 'Information',
			about: 'About',
			career: 'Career',
			projects: 'Projects',
			languages: 'Languages',
			skills: 'Skills',
			informatic: 'Informatic',
			certifications: 'Certifications',
			contact: 'Contact',
			complementary: 'Complementary',
			reviews: 'Reviews',
			writeReview: 'Write a Review',
			reviewSent: 'Your review has been submitted successfully and is pending approval.',
			review: 'Review',
			reviewPlaceholder: 'Write your review here...',
			url: 'Web / LinkedIn URL',
			avatar: 'Avatar Image',
			jobPlaceholder: 'Current job',
			avatarHelp: 'Upload a profile image (jpg, png, gif, webp - max 2MB)',
			age: 'Age',
			country: 'Country',
			job: 'Job',
			email: 'Email',
			currentJob: 'Current job',
			phone: 'Phone',
			location: 'Location',
			interests: 'Interests',
			professionalGoals: 'Professional Goals',
			programmingLanguages: 'Programming Languages',
			softwareTools: 'Software & Tools',
			viewCredential: 'View credential',
			loading: 'Loading data...',
			oralComprehension: 'Oral Comprehension',
			speaking: 'Speaking',
			readingComprehension: 'Reading Comprehension',
			writing: 'Writing',
			expires: 'Expires',
			contactForm: 'Contact Form',
			name: 'Name',
			namePlaceholder: 'Enter your name',
			emailPlaceholder: 'yourname@example.com',
			phonePlaceholder: '+34 XXX XXX XXX',
			company: 'Company',
			companyPlaceholder: 'Your company name',
			message: 'Message',
			messagePlaceholder: 'Write your message here...',
			requiredFields: '* Required fields',
			send: 'Send Message',
			socialNetworks: 'Connect with me',
			sending: 'Sending...',
			messageSent: 'Your message has been sent successfully.',
			errorSending: 'There was an error sending your message. Please try again later.'
		},
		games: {
			title: 'Games',
			minesweeper: {
				title: 'Minesweeper',
				beginner: 'Beginner',
				intermediate: 'Intermediate',
				expert: 'Expert',
				flagModeEnabled: 'Enabled',
				flagModeDisabled: 'Disabled'
			},
			snake: {
				title: 'Snake',
				beginner: 'Beginner',
				intermediate: 'Intermediate',
				expert: 'Expert',
				gameover: 'Game Over',
				victory: 'Victory',
				paused: 'Paused'
			},
			tetris: {
				title: 'Tetris',
				score: 'Score',
				level: 'Level',
				lines: 'Lines',
				time: 'Time',
				easy: 'Easy',
				normal: 'Normal',
				hard: 'Hard',
				reset: 'Reset',
				pause: 'Pause',
				resume: 'Resume',
				gameover: 'Game Over',
				playagain: 'Play Again',
				paused: 'Paused',
				next: 'Next Piece',
				controls: 'Controls',
				moveleft: 'Move Left',
				moveright: 'Move Right',
				movedown: 'Move Down',
				rotate: 'Rotate',
				harddrop: 'Hard Drop'
			},
			dino: {
				title: 'Dino Runner',
				pause: 'Pause',
				resume: 'Resume',
				restart: 'Restart',
				resetScore: 'Reset High Score',
				howToPlay: 'How to Play:',
				jump: 'Jump',
				duck: 'Duck',
				gameover: 'Game Over'
			},
			sudoku: {
				title: 'Sudoku',
				beginner: 'Beginner',
				intermediate: 'Intermediate',
				expert: 'Expert',
				mistakes: 'Mistakes',
				reset: 'Reset',
				pause: 'Pause',
				resume: 'Resume',
				notes: 'Notes',
				victory: 'Victory!',
				gameover: 'Game Over',
				playAgain: 'Play Again',
				paused: 'Paused'
			},
			comingSoon: 'Coming Soon'
		},
		softwares: {
			title: 'Softwares',
			paint: {
				title: 'Paint',
				size: 'Size',
				colors: 'Colors',
				customColorPicker: 'Custom color picker',
				newFile: 'New File',
				open: 'Open',
				save: 'Save',
				saveAs: 'Save As',
				pencil: 'Pencil',
				line: 'Line',
				rectangle: 'Rectangle',
				circle: 'Circle',
				eraser: 'Eraser',
				fill: 'Fill'
			},
			calculator: {
				title: 'Calculator',
				clear: 'Clear',
				equals: 'Equals',
				add: 'Add',
				subtract: 'Subtract',
				multiply: 'Multiply',
				divide: 'Divide',
				decimal: 'Decimal',
				percent: 'Percent',
				negate: 'Negate',
				backspace: 'Backspace'
			},
			terminal: {
				title: 'Terminal',
				welcome: "Welcome. Type 'help' for available commands.",
				noSuchDirectory: 'No such directory',
				noSuchFile: 'No such file',
				missingFileOperand: 'cat: missing file operand',
				commandNotFound: 'Command not found',
				typeHelp: "Type 'help' for available commands",
				errorExecuting: 'Error executing command',
				unknownError: 'Unknown error',
				commands: {
					help: 'Show list of available commands',
					clear: 'Clear terminal screen',
					echo: 'Echo a message',
					whoami: 'Display current user',
					ls: 'List directory contents',
					cd: 'Change directory',
					pwd: 'Print working directory',
					cat: 'Concatenate and display file content',
					profile: 'Display profile information',
					projects: 'List all projects',
					skills: 'List all skills',
					contact: 'Display contact information',
					date: 'Display current date and time',
					open: 'Open portfolio website',
					input: 'Command input'
				}
			},
			browser: {
				title: 'Browser',
				back: 'Back',
				forward: 'Forward',
				reload: 'Reload',
				enterUrl: 'Enter URL',
				addressBar: 'Address bar',
				go: 'Go',
				loading: 'Loading...',
				content: 'Browser content',
				errorLoading: 'Error loading page'
			}
		},
		chatbot: {
			title: 'Thalía',
			greeting: 'Hello, how can I help you? You can ask me about Adrián, his projects or skills.',
			greetingAlt: "Hi there! I'm Thalía, Adrián's virtual assistant. How can I help you today?",
			greetingAlt2:
				"Welcome! I'm here to answer your questions about Adrián. What would you like to know?",
			greetingAgain: 'How can I help you with something else?',
			greetingAgainAlt: 'What else would you like to know about Adrián?',
			greetingAgainAlt2: "I'm still here to help. What else are you interested in?",
			help: 'You can ask me about Adrián\'s personal information, skills, projects, languages, certifications or work experience. For example: "tell me about him", "what projects does he have", "what skills does he have".',
			helpAlt:
				"Feel free to ask about Adrián's background, skills, projects, or anything else you'd like to know. I'm here to help!",
			helpAlt2:
				"I can tell you about Adrián's expertise, work history, projects, and more. Just let me know what interests you.",
			aboutPerson: '{name} is a {job}. {description}',
			aboutPersonAlt: "Let me tell you about {name}. He's a {job} who {description}",
			aboutPersonAlt2: '{name} works as a {job}. In summary, {description}',
			currentJob: 'Adrián currently works at {company} ({url})',
			currentJobAlt: 'Right now, Adrián is employed at {company}. You can check them out at {url}',
			currentJobAlt2: "Adrián's current workplace is {company}. Their website is {url}",
			defaultJob: 'He currently works at NetexLearning',
			defaultJobAlt: "At present, he's part of the NetexLearning team",
			defaultJobAlt2: 'His current position is at NetexLearning',
			defaultAbout: 'He is a full stack developer with experience in various technologies.',
			defaultAboutAlt:
				'He specializes in full stack development and has worked with many different technologies.',
			defaultAboutAlt2:
				'As a full stack developer, he has experience across multiple technologies and platforms.',
			skills: "Adrián's main skill categories are: {skills}",
			skillsAlt: 'The key areas of expertise for Adrián include: {skills}',
			skillsAlt2: 'Adrián specializes in these skill categories: {skills}',
			topSkills: "Some of Adrián's skills are: {skills}",
			topSkillsAlt: 'Adrián is proficient in: {skills}',
			topSkillsAlt2: "Among Adrián's technical abilities are: {skills}",
			defaultSkills: 'Adrián has skills in full stack development, DevOps, and automation',
			defaultSkillsAlt:
				"Adrián's expertise includes full stack development, DevOps practices, and automation techniques",
			defaultSkillsAlt2:
				'Adrián is proficient in full stack development, DevOps methodologies, and automation workflows',
			programmingLanguages:
				'Adrián works with several programming languages, including: {languages}',
			programmingLanguagesAlt: 'The programming languages Adrián uses include: {languages}',
			programmingLanguagesAlt2: 'Adrián codes in various languages such as: {languages}',
			defaultProgramming:
				'Adrián mainly works with TypeScript, JavaScript, Python and other languages',
			defaultProgrammingAlt:
				"TypeScript, JavaScript, and Python are among Adrián's primary programming languages",
			defaultProgrammingAlt2:
				'Adrián primarily codes in TypeScript, JavaScript, and Python, with experience in other languages too',
			singleProject: 'An interesting project is "{name}": {description}',
			singleProjectAlt: 'You might be interested in "{name}": {description}',
			singleProjectAlt2: 'One notable project worth mentioning is "{name}": {description}',
			projects: 'Adrián has {count} projects in his portfolio. Some notable ones are: {projects}',
			projectsAlt: 'With {count} projects in his portfolio, some highlights include: {projects}',
			projectsAlt2: 'Across his {count} projects, some of the standouts are: {projects}',
			projectsCount:
				'Adrián has {count} projects in his portfolio. You can ask me about a specific project.',
			projectsCountAlt:
				"Adrián's portfolio contains {count} projects. Feel free to ask about any specific one.",
			projectsCountAlt2:
				"There are {count} projects in Adrián's portfolio. Would you like details about a particular one?",
			featuredProjects: "Some of Adrián's featured projects are: {projects}",
			featuredProjectsAlt: "Adrián's showcase projects include: {projects}",
			featuredProjectsAlt2: "The highlights of Adrián's portfolio are: {projects}",
			defaultProjects:
				'Adrián has worked on several projects like PortfoliOS (this portfolio), CloudShot and others',
			defaultProjectsAlt:
				"Some of Adrián's notable projects include PortfoliOS (this portfolio) and CloudShot, among others",
			defaultProjectsAlt2:
				'Adrián has developed projects such as this portfolio (PortfoliOS) and CloudShot, plus several others',
			languages: 'Adrián speaks: {languages}',
			languagesAlt: 'The languages Adrián is fluent in are: {languages}',
			languagesAlt2: "Adrián's language capabilities include: {languages}",
			defaultLanguages: 'Adrián speaks Spanish, Galician and English',
			defaultLanguagesAlt: 'Spanish, Galician, and English are the languages Adrián speaks',
			defaultLanguagesAlt2: 'Adrián is proficient in Spanish, Galician, and English',
			certifications: 'Adrián has {count} certifications. Some are: {certs}',
			certificationsAlt: 'With {count} certifications to his name, some key ones include: {certs}',
			certificationsAlt2: 'Adrián holds {count} certifications, including: {certs}',
			defaultCertifications: 'Adrián has several professional certifications',
			defaultCertificationsAlt: 'Adrián holds a number of professional certifications in his field',
			defaultCertificationsAlt2:
				"Among Adrián's credentials are various professional certifications",
			currentPosition: 'Adrián currently works at {company} as {position}',
			currentPositionAlt: 'At present, Adrián is a {position} at {company}',
			currentPositionAlt2: "Adrián's role at {company} is {position}",
			defaultPosition: 'Adrián currently works as a full stack developer at NetexLearning',
			defaultPositionAlt:
				'Currently, Adrián is employed as a full stack developer with NetexLearning',
			defaultPositionAlt2: 'Adrián works at NetexLearning as a full stack developer',
			skillCategory: 'Adrián has skills in {category}',
			skillCategoryAlt: 'In terms of {category}, Adrián has substantial expertise',
			skillCategoryAlt2: 'Adrián is knowledgeable in the {category} domain',
			projectDescription: 'Project "{name}": {description}',
			projectDescriptionAlt: 'About the "{name}" project: {description}',
			projectDescriptionAlt2: 'The "{name}" project involves: {description}',
			defaultResponse:
				"Sorry, I don't understand the question. You can ask about Adrián's personal information, skills, projects, languages, certifications, or work experience.",
			defaultResponseAlt:
				"I'm not sure I understand your question. Try asking about Adrián's background, projects, skills, or other qualifications.",
			defaultResponseAlt2:
				"I didn't quite catch that. Feel free to ask about Adrián's work, skills, education, or projects.",
			thanks: "You're welcome! Let me know if you have any other questions.",
			thanksAlt: "Happy to help! Any other information you'd like to know?",
			thanksAlt2: 'Glad I could assist. What else can I tell you about Adrián?',
			goodbye: 'Goodbye! Feel free to ask more questions anytime.',
			goodbyeAlt: 'Have a great day! Come back if you need more information.',
			goodbyeAlt2: "Until next time! Don't hesitate to return with more questions.",
			aboutDescription: '{description}',
			aboutDescriptionAlt: 'Let me tell you a bit about Adrián: {description}',
			aboutDescriptionAlt2: "Here's some background on Adrián: {description}",
			contactInfo: 'You can reach Adrián at {email}',
			contactInfoAlt: "Adrián's contact email is {email}",
			contactInfoAlt2: 'To get in touch with Adrián, use {email}',
			location: 'Adrián is based in {location}',
			locationAlt: 'Adrián currently lives in {location}',
			locationAlt2: "Adrián's location is {location}",
			hobbies:
				'In his free time, Adrián enjoys coding personal projects, learning new technologies, and exploring automation solutions.',
			hobbiesAlt:
				"Adrián's interests include working on personal coding projects and studying new technologies and automation techniques.",
			hobbiesAlt2:
				'When not working, Adrián likes to develop personal projects and learn about emerging technologies.',
			goals:
				'Adrián aims to create high-quality web applications, contribute to open source, and share knowledge with others.',
			goalsAlt:
				'Professionally, Adrián focuses on building excellent web applications and contributing to open source projects.',
			goalsAlt2:
				"Adrián's goals include creating impactful web applications and sharing his expertise with the community.",
			motivation:
				'Adrián is driven by the opportunity to solve complex problems and create solutions that make a difference.',
			motivationAlt:
				'What motivates Adrián is the challenge of tackling difficult problems and building meaningful solutions.',
			motivationAlt2:
				'Adrián finds motivation in problem-solving and creating impactful applications.',
			approach:
				'Adrián approaches projects methodically, focusing on maintainable code, automation, and continuous improvement.',
			approachAlt:
				'When working on projects, Adrián values clean code, automation, and iterative development.',
			approachAlt2:
				"Adrián's methodology emphasizes code quality, automation, and ongoing refinement.",
			suggestSkills: "Would you like to know about Adrián's technical skills?",
			suggestSkillsAlt: "I could tell you about Adrián's areas of expertise if you're interested.",
			suggestSkillsAlt2:
				"Would you be interested in learning about Adrián's technical capabilities?",
			suggestProjects: "I can tell you more about Adrián's projects if you'd like.",
			suggestProjectsAlt: 'Would you like to hear about some of the projects Adrián has worked on?',
			suggestProjectsAlt2:
				"I could share details about Adrián's portfolio of projects if that interests you.",
			suggestCertifications:
				'Adrián also has several professional certifications. Would you like to know about them?',
			suggestCertificationsAlt:
				"I can tell you about Adrián's professional certifications if you're interested.",
			suggestCertificationsAlt2:
				'Would you like to learn about the certifications Adrián has earned?',
			suggestExperience: "Would you like to know more about Adrián's work experience?",
			suggestExperienceAlt:
				"I could share details about Adrián's professional background if you're curious.",
			suggestExperienceAlt2: "Would you be interested in hearing about Adrián's career journey?",
			suggestContact:
				"If you'd like to get in touch with Adrián, I can provide his contact information.",
			suggestContactAlt: "Would you like Adrián's contact details?",
			suggestContactAlt2: 'I can share how to reach Adrián if you need to contact him.',
			suggestBackground: "Would you like to learn more about Adrián's background and education?",
			suggestBackgroundAlt:
				"I could tell you about Adrián's educational journey if you're interested.",
			suggestBackgroundAlt2: "Would you like to know about Adrián's educational background?",
			error: 'Sorry, an error occurred while processing your question.',
			welcome:
				"Hello, I'm Thalía, Adrián's virtual assistant. You can ask me about his personal information, skills, projects, languages, certifications, or work experience. I can also answer in Spanish.",
			welcomeAlt:
				"¡Hi! I'm Thalía, Adrián's virtual assistant. You can ask me about his personal information, skills, projects, languages, certifications, or work experience. I can also answer in Spanish.",
			welcomeAlt2:
				"¡Hi! I'm Thalía, Adrián's virtual assistant. You can ask me about his personal information, skills, projects, languages, certifications, or work experience. I can also answer in Spanish.",
			loadError:
				"Sorry, I couldn't load the information. Error: {error}. I'll still try to answer your questions.",
			loadErrorAlt:
				"Sorry, I couldn't load the information. Error: {error}. I'll still try to answer your questions.",
			loadErrorAlt2:
				"Sorry, I couldn't load the information. Error: {error}. I'll still try to answer your questions.",
			inputPlaceholder: 'Ask me something...',
			send: 'Send'
		}
	},
	es: {
		system: {
			loading: 'Iniciando...'
		},
		folder: {
			search: 'Buscar',
			quickAccess: 'Acceso rápido',
			thisPC: 'Este equipo'
		},
		login: {
			title: 'Portfolio',
			subtitle: 'Elige un perfil para continuar',
			users: {
				recruiter: 'Reclutador',
				developer: 'Desarrollador',
				stalker: 'Investigador',
				adventurer: 'Aventurero'
			},
			welcomeMessage: 'Bienvenido, {user}'
		},
		mobile: {
			desktopRecommendation: {
				title: 'Experiencia de Escritorio',
				message:
					'Esta web está diseñada para ofrecer una mejor experiencia en dispositivos de escritorio.',
				continueMobile: 'Continuar en Móvil'
			},
			preferences: {
				title: 'Preferencias',
				language: 'Idioma',
				english: 'Inglés',
				spanish: 'Español',
				theme: 'Tema',
				light: 'Claro',
				dark: 'Oscuro',
				continue: 'Continuar'
			}
		},
		taskbar: {
			search: 'Buscar',
			language: 'Idioma',
			theme: 'Cambiar tema'
		},
		window: {
			minimize: 'Minimizar',
			maximize: 'Maximizar',
			restore: 'Restaurar',
			close: 'Cerrar',
			resize: 'Redimensionar'
		},
		profile: {
			title: 'Perfil',
			information: 'Información',
			about: 'Sobre mí',
			career: 'Trayectoria',
			projects: 'Proyectos',
			languages: 'Idiomas',
			skills: 'Habilidades',
			informatic: 'Informática',
			certifications: 'Certificaciones',
			contact: 'Contacto',
			complementary: 'Complementario',
			reviews: 'Reseñas',
			writeReview: 'Escribe una reseña',
			reviewSent: 'Tu reseña ha sido enviada correctamente y está pendiente de aprobación.',
			review: 'Reseña',
			reviewPlaceholder: 'Escribe tu reseña aquí...',
			url: 'Web / LinkedIn URL',
			avatar: 'Imagen de Avatar',
			jobPlaceholder: 'Trabajo actual',
			avatarHelp: 'Cargar una imagen de perfil (jpg, png, gif, webp - max 2MB)',
			age: 'Edad',
			country: 'País',
			job: 'Trabajo',
			email: 'Correo electrónico',
			currentJob: 'Trabajo actual',
			phone: 'Teléfono',
			location: 'Ubicación',
			interests: 'Intereses',
			professionalGoals: 'Objetivos Profesionales',
			programmingLanguages: 'Lenguajes de Programación',
			softwareTools: 'Software y Herramientas',
			viewCredential: 'Ver credencial',
			loading: 'Cargando datos...',
			oralComprehension: 'Comprensión Oral',
			speaking: 'Expresión Oral',
			readingComprehension: 'Comprensión Lectora',
			writing: 'Expresión Escrita',
			expires: 'Expira',
			contactForm: 'Formulario de contacto',
			name: 'Nombre',
			namePlaceholder: 'Introduce tu nombre',
			emailPlaceholder: 'tunombre@ejemplo.com',
			phonePlaceholder: '+34 XXX XXX XXX',
			company: 'Empresa',
			companyPlaceholder: 'Nombre de tu empresa',
			message: 'Mensaje',
			messagePlaceholder: 'Escribe tu mensaje aquí...',
			requiredFields: '* Campos obligatorios',
			send: 'Enviar mensaje',
			socialNetworks: 'Conéctate conmigo',
			sending: 'Enviando...',
			messageSent: 'Tu mensaje se ha enviado correctamente.',
			errorSending: 'Hubo un error al enviar tu mensaje. Por favor, inténtalo más tarde.'
		},
		games: {
			title: 'Juegos',
			minesweeper: {
				title: 'Buscaminas',
				beginner: 'Principiante',
				intermediate: 'Intermedio',
				expert: 'Experto',
				flagModeEnabled: 'Activado',
				flagModeDisabled: 'Desactivado'
			},
			snake: {
				title: 'Snake',
				beginner: 'Principiante',
				intermediate: 'Intermedio',
				expert: 'Experto',
				gameover: '¡Has perdido!',
				victory: '¡Has ganado!',
				paused: 'Pausa'
			},
			tetris: {
				title: 'Tetris',
				score: 'Puntuación',
				level: 'Nivel',
				lines: 'Líneas',
				time: 'Tiempo',
				easy: 'Fácil',
				normal: 'Normal',
				hard: 'Difícil',
				reset: 'Reiniciar',
				pause: 'Pausa',
				resume: 'Continuar',
				gameover: '¡Juego terminado!',
				playagain: 'Jugar de nuevo',
				paused: 'Pausado',
				next: 'Siguiente pieza',
				controls: 'Controles',
				moveleft: 'Mover izquierda',
				moveright: 'Mover derecha',
				movedown: 'Mover abajo',
				rotate: 'Rotar',
				harddrop: 'Caída rápida'
			},
			dino: {
				title: 'Dino Runner',
				pause: 'Pausar',
				resume: 'Continuar',
				restart: 'Reiniciar',
				resetScore: 'Reiniciar Puntuación',
				howToPlay: 'Cómo jugar:',
				jump: 'Saltar',
				duck: 'Agacharse',
				gameover: 'Juego Terminado'
			},
			sudoku: {
				title: 'Sudoku',
				beginner: 'Principiante',
				intermediate: 'Intermedio',
				expert: 'Experto',
				mistakes: 'Errores',
				reset: 'Reiniciar',
				pause: 'Pausar',
				resume: 'Continuar',
				notes: 'Notas',
				victory: '¡Victoria!',
				gameover: 'Juego Terminado',
				playAgain: 'Jugar de nuevo',
				paused: 'Pausado'
			},
			comingSoon: 'Próximamente'
		},
		softwares: {
			title: 'Softwares',
			paint: {
				title: 'Paint',
				size: 'Size',
				colors: 'Colors',
				customColorPicker: 'Custom color picker',
				newFile: 'New File',
				open: 'Open',
				save: 'Save',
				saveAs: 'Save As',
				pencil: 'Pencil',
				line: 'Line',
				rectangle: 'Rectangle',
				circle: 'Circle',
				eraser: 'Eraser',
				fill: 'Fill'
			},
			calculator: {
				title: 'Calculadora',
				clear: 'Limpiar',
				equals: 'Igual',
				add: 'Sumar',
				subtract: 'Restar',
				multiply: 'Multiplicar',
				divide: 'Dividir',
				decimal: 'Decimal',
				percent: 'Porcentaje',
				negate: 'Negativo',
				backspace: 'Retroceso'
			},
			terminal: {
				title: 'Terminal',
				welcome: "Bienvenido. Escribe 'help' para ver los comandos disponibles.",
				noSuchDirectory: 'No existe el directorio',
				noSuchFile: 'No existe el archivo',
				missingFileOperand: 'cat: falta el operando del archivo',
				commandNotFound: 'Comando no encontrado',
				typeHelp: "Escribe 'help' para ver los comandos disponibles",
				errorExecuting: 'Error al ejecutar el comando',
				unknownError: 'Error desconocido',
				commands: {
					help: 'Mostrar lista de comandos disponibles',
					clear: 'Limpiar pantalla de la terminal',
					echo: 'Mostrar un mensaje',
					whoami: 'Mostrar usuario actual',
					ls: 'Listar contenido del directorio',
					cd: 'Cambiar directorio',
					pwd: 'Mostrar directorio de trabajo actual',
					cat: 'Concatenar y mostrar contenido de archivo',
					profile: 'Mostrar información del perfil',
					projects: 'Listar todos los proyectos',
					skills: 'Listar todas las habilidades',
					contact: 'Mostrar información de contacto',
					date: 'Mostrar fecha y hora actual',
					open: 'Abrir sitio web del portfolio',
					input: 'Entrada de comandos'
				}
			},
			browser: {
				title: 'Navegador',
				back: 'Atrás',
				forward: 'Adelante',
				reload: 'Recargar',
				enterUrl: 'Introduce URL',
				addressBar: 'Barra de direcciones',
				go: 'Ir',
				loading: 'Cargando...',
				content: 'Contenido del navegador',
				errorLoading: 'Error al cargar la página'
			}
		},
		chatbot: {
			title: 'Thalía',
			greeting:
				'Hola, ¿en qué puedo ayudarte? Puedes preguntarme sobre Adrián, sus proyectos o habilidades.',
			greetingAlt: '¡Hola! Soy Thalía, la asistente virtual de Adrián. ¿Cómo puedo ayudarte hoy?',
			greetingAlt2:
				'¡Bienvenido! Estoy aquí para responder tus preguntas sobre Adrián. ¿Qué te gustaría saber?',
			greetingAgain: '¿En qué más puedo ayudarte?',
			greetingAgainAlt: '¿Qué más te gustaría saber sobre Adrián?',
			greetingAgainAlt2: 'Sigo aquí para ayudarte. ¿Qué más te interesa?',
			help: 'Puedes preguntarme sobre la información personal de Adrián, sus habilidades, proyectos, idiomas, certificaciones o experiencia laboral. Por ejemplo: "cuéntame sobre él", "qué proyectos tiene", "qué habilidades tiene".',
			helpAlt:
				'Siéntete libre de preguntar sobre la información de Adrián, habilidades, proyectos o cualquier otra cosa que te gustaría saber. ¡Estoy aquí para ayudar!',
			helpAlt2:
				'Puedo contarte sobre la experiencia de Adrián, historial laboral, proyectos y más. Solo dime qué te interesa.',
			aboutPerson: '{name} es {job}. {description}',
			aboutPersonAlt: 'Déjame contarte sobre {name}. Es {job} que {description}',
			aboutPersonAlt2: '{name} trabaja como {job}. En resumen, {description}',
			currentJob: 'Actualmente Adrián trabaja en {company} ({url})',
			currentJobAlt:
				'En este momento, Adrián está empleado en {company}. Puedes consultarlos en {url}',
			currentJobAlt2: 'El lugar de trabajo actual de Adrián es {company}. Su sitio web es {url}',
			defaultJob: 'Actualmente trabaja en NetexLearning',
			defaultJobAlt: 'En la actualidad, forma parte del equipo de NetexLearning',
			defaultJobAlt2: 'Su puesto actual está en NetexLearning',
			defaultAbout: 'Es un desarrollador full stack con experiencia en varias tecnologías.',
			defaultAboutAlt:
				'Se especializa en desarrollo full stack y ha trabajado con muchas tecnologías diferentes.',
			defaultAboutAlt2:
				'Como desarrollador full stack, tiene experiencia en múltiples tecnologías y plataformas.',
			skills: 'Las principales categorías de habilidades de Adrián son: {skills}',
			skillsAlt: 'Las áreas clave de experiencia de Adrián incluyen: {skills}',
			skillsAlt2: 'Adrián se especializa en estas categorías de habilidades: {skills}',
			topSkills: 'Algunas de las habilidades de Adrián son: {skills}',
			topSkillsAlt: 'Adrián es competente en: {skills}',
			topSkillsAlt2: 'Entre las habilidades técnicas de Adrián están: {skills}',
			defaultSkills: 'Adrián tiene habilidades en desarrollo full stack, DevOps, y automatización',
			defaultSkillsAlt:
				'La experiencia de Adrián incluye desarrollo full stack, prácticas DevOps y técnicas de automatización',
			defaultSkillsAlt2:
				'Adrián es competente en desarrollo full stack, metodologías DevOps y flujos de trabajo de automatización',
			programmingLanguages:
				'Adrián maneja varios lenguajes de programación, incluyendo: {languages}',
			programmingLanguagesAlt:
				'Los lenguajes de programación que Adrián utiliza incluyen: {languages}',
			programmingLanguagesAlt2: 'Adrián programa en varios lenguajes como: {languages}',
			defaultProgramming:
				'Adrián trabaja principalmente con TypeScript, JavaScript, Python y otros lenguajes',
			defaultProgrammingAlt:
				'TypeScript, JavaScript y Python están entre los principales lenguajes de programación de Adrián',
			defaultProgrammingAlt2:
				'Adrián principalmente programa en TypeScript, JavaScript y Python, con experiencia en otros lenguajes también',
			singleProject: 'Un proyecto interesante es "{name}": {description}',
			singleProjectAlt: 'Te podría interesar "{name}": {description}',
			singleProjectAlt2:
				'Un proyecto notable que vale la pena mencionar es "{name}": {description}',
			projects:
				'Adrián tiene {count} proyectos en su portafolio. Algunos destacados son: {projects}',
			projectsAlt:
				'Con {count} proyectos en su portafolio, algunos destacados incluyen: {projects}',
			projectsAlt2:
				'A lo largo de sus {count} proyectos, algunos de los más destacados son: {projects}',
			projectsCount:
				'Adrián tiene {count} proyectos en su portafolio. Puedes preguntarme por algún proyecto específico.',
			projectsCountAlt:
				'El portafolio de Adrián contiene {count} proyectos. Siéntete libre de preguntar sobre alguno específico.',
			projectsCountAlt2:
				'Hay {count} proyectos en el portafolio de Adrián. ¿Te gustaría detalles sobre alguno en particular?',
			featuredProjects: 'Algunos proyectos destacados de Adrián son: {projects}',
			featuredProjectsAlt: 'Los proyectos destacados de Adrián incluyen: {projects}',
			featuredProjectsAlt2: 'Lo más destacado del portafolio de Adrián son: {projects}',
			defaultProjects:
				'Adrián ha trabajado en varios proyectos como PortfoliOS (este portafolio), CloudShot y otros',
			defaultProjectsAlt:
				'Algunos de los proyectos notables de Adrián incluyen PortfoliOS (este portafolio) y CloudShot, entre otros',
			defaultProjectsAlt2:
				'Adrián ha desarrollado proyectos como este portafolio (PortfoliOS) y CloudShot, además de varios otros',
			languages: 'Adrián habla: {languages}',
			languagesAlt: 'Los idiomas en los que Adrián es fluido son: {languages}',
			languagesAlt2: 'Las capacidades lingüísticas de Adrián incluyen: {languages}',
			defaultLanguages: 'Adrián habla español, gallego e inglés',
			defaultLanguagesAlt: 'Español, gallego e inglés son los idiomas que habla Adrián',
			defaultLanguagesAlt2: 'Adrián domina el español, gallego e inglés',
			certifications: 'Adrián tiene {count} certificaciones. Algunas son: {certs}',
			certificationsAlt: 'Con {count} certificaciones a su nombre, algunas clave incluyen: {certs}',
			certificationsAlt2: 'Adrián posee {count} certificaciones, incluyendo: {certs}',
			defaultCertifications: 'Adrián cuenta con varias certificaciones profesionales',
			defaultCertificationsAlt:
				'Adrián posee una serie de certificaciones profesionales en su campo',
			defaultCertificationsAlt2:
				'Entre las credenciales de Adrián hay varias certificaciones profesionales',
			currentPosition: 'Actualmente Adrián trabaja en {company} como {position}',
			currentPositionAlt: 'En la actualidad, Adrián es {position} en {company}',
			currentPositionAlt2: 'El rol de Adrián en {company} es {position}',
			defaultPosition: 'Actualmente Adrián trabaja como desarrollador full stack en NetexLearning',
			defaultPositionAlt:
				'Actualmente, Adrián está empleado como desarrollador full stack en NetexLearning',
			defaultPositionAlt2: 'Adrián trabaja en NetexLearning como desarrollador full stack',
			skillCategory: 'Adrián tiene habilidades en {category}',
			skillCategoryAlt: 'En términos de {category}, Adrián tiene una experiencia sustancial',
			skillCategoryAlt2: 'Adrián tiene conocimientos en el dominio de {category}',
			projectDescription: 'Proyecto "{name}": {description}',
			projectDescriptionAlt: 'Sobre el proyecto "{name}": {description}',
			projectDescriptionAlt2: 'El proyecto "{name}" involucra: {description}',
			defaultResponse:
				'Lo siento, no entiendo la pregunta. Puedes preguntar sobre información personal, habilidades, proyectos, idiomas, certificaciones o experiencia laboral de Adrián.',
			defaultResponseAlt:
				'No estoy segura de entender tu pregunta. Intenta preguntar sobre proyectos, habilidades u otras cualificaciones de Adrián.',
			defaultResponseAlt2:
				'No entendí bien eso. Siéntete libre de preguntar sobre el trabajo, habilidades, educación o proyectos de Adrián.',
			thanks: '¡De nada! Hazme saber si tienes alguna otra pregunta.',
			thanksAlt: '¡Encantada de ayudar! ¿Alguna otra información que te gustaría saber?',
			thanksAlt2: 'Me alegra haber podido ayudar. ¿Qué más puedo contarte sobre Adrián?',
			goodbye: '¡Adiós! No dudes en hacer más preguntas cuando quieras.',
			goodbyeAlt: '¡Que tengas un buen día! Vuelve si necesitas más información.',
			goodbyeAlt2: '¡Hasta la próxima! No dudes en volver con más preguntas.',
			aboutDescription: '{description}',
			aboutDescriptionAlt: 'Déjame contarte un poco sobre Adrián: {description}',
			aboutDescriptionAlt2: 'Aquí hay algunos detalles sobre Adrián: {description}',
			contactInfo: 'Puedes contactar con Adrián en {email}',
			contactInfoAlt: 'El correo electrónico de contacto de Adrián es {email}',
			contactInfoAlt2: 'Para ponerte en contacto con Adrián, usa {email}',
			location: 'Adrián está ubicado en {location}',
			locationAlt: 'Adrián actualmente vive en {location}',
			locationAlt2: 'La ubicación de Adrián es {location}',
			hobbies:
				'En su tiempo libre, a Adrián le gusta programar proyectos personales, aprender nuevas tecnologías y explorar soluciones de automatización.',
			hobbiesAlt:
				'Los intereses de Adrián incluyen trabajar en proyectos de codificación personal y estudiar nuevas tecnologías y técnicas de automatización.',
			hobbiesAlt2:
				'Cuando no está trabajando, a Adrián le gusta desarrollar proyectos personales y aprender sobre tecnologías emergentes.',
			goals:
				'Adrián aspira a crear aplicaciones web de alta calidad, contribuir al código abierto y compartir conocimientos con otros.',
			goalsAlt:
				'Profesionalmente, Adrián se centra en construir excelentes aplicaciones web y contribuir a proyectos de código abierto.',
			goalsAlt2:
				'Los objetivos de Adrián incluyen crear aplicaciones web impactantes y compartir su experiencia con la comunidad.',
			motivation:
				'Adrián se siente motivado por la oportunidad de resolver problemas complejos y crear soluciones que marquen la diferencia.',
			motivationAlt:
				'Lo que motiva a Adrián es el desafío de abordar problemas difíciles y construir soluciones significativas.',
			motivationAlt2:
				'Adrián encuentra motivación en la resolución de problemas y la creación de aplicaciones impactantes.',
			approach:
				'Adrián aborda los proyectos metódicamente, centrándose en código mantenible, automatización y mejora continua.',
			approachAlt:
				'Cuando trabaja en proyectos, Adrián valora el código limpio, la automatización y el desarrollo iterativo.',
			approachAlt2:
				'La metodología de Adrián enfatiza la calidad del código, la automatización y el refinamiento continuo.',
			suggestSkills: '¿Te gustaría conocer las habilidades técnicas de Adrián?',
			suggestSkillsAlt: 'Podría contarte sobre las áreas de experiencia de Adrián si te interesa.',
			suggestSkillsAlt2: '¿Te interesaría aprender sobre las capacidades técnicas de Adrián?',
			suggestProjects: 'Puedo contarte más sobre los proyectos de Adrián si quieres.',
			suggestProjectsAlt:
				'¿Te gustaría escuchar sobre algunos de los proyectos en los que ha trabajado Adrián?',
			suggestProjectsAlt2:
				'Podría compartir detalles sobre el portafolio de proyectos de Adrián si eso te interesa.',
			suggestCertifications:
				'Adrián también tiene varias certificaciones profesionales. ¿Te gustaría conocerlas?',
			suggestCertificationsAlt:
				'Puedo contarte sobre las certificaciones profesionales de Adrián si te interesa.',
			suggestCertificationsAlt2: '¿Te gustaría conocer las certificaciones que Adrián ha obtenido?',
			suggestExperience: '¿Te gustaría saber más sobre la experiencia laboral de Adrián?',
			suggestExperienceAlt:
				'Podría compartir detalles sobre la experiencia profesional de Adrián si tienes curiosidad.',
			suggestExperienceAlt2: '¿Te interesaría escuchar sobre la trayectoria profesional de Adrián?',
			suggestContact:
				'Si deseas ponerte en contacto con Adrián, puedo proporcionarte su información de contacto.',
			suggestContactAlt: '¿Te gustaría tener los datos de contacto de Adrián?',
			suggestContactAlt2:
				'Puedo compartir cómo contactar con Adrián si necesitas comunicarte con él.',
			suggestBackground: '¿Te gustaría aprender más sobre la educación y el desarrollo de Adrián?',
			suggestBackgroundAlt:
				'Podría contarte sobre la trayectoria educativa de Adrián si te interesa.',
			suggestBackgroundAlt2: '¿Te gustaría conocer sobre el pasado educativo de Adrián?',
			error: 'Lo siento, ha ocurrido un error al procesar tu pregunta.',
			welcome:
				'Hola, soy Thalía, el asistente virtual de Adrián. Puedes preguntarme sobre su información personal, habilidades, proyectos, idiomas, certificaciones o experiencia laboral. También puedo responder en inglés.',
			welcomeAlt:
				'¡Hola! Estoy aquí para contarte todo sobre Adrián - proyectos, habilidades y más. Siéntete libre de preguntar en español o inglés.',
			welcomeAlt2:
				'¡Bienvenido! Soy Thalía, el asistente digital de Adrián. Pregúntame cualquier cosa sobre su trabajo o habilidades. Hablo con fluidez tanto en español como en inglés.',
			loadError:
				'Lo siento, no he podido cargar la información. Error: {error}. Aún así, intentaré responder a tus preguntas.',
			loadErrorAlt:
				'Hubo un problema al cargar los datos (Error: {error}), pero haré lo posible por responder a tus preguntas de todos modos.',
			loadErrorAlt2:
				'He encontrado un problema al cargar la información (Error: {error}). Intentaré responder a tus preguntas con lo que sé.',
			inputPlaceholder: 'Pregúntame algo...',
			send: 'Enviar'
		}
	}
};
