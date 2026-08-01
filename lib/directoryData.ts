export type DirectoryCategory = "country" | "city" | "language" | "topic";

export type DirectoryItem = {
  slug: string;
  title: string;
  category: DirectoryCategory;
  name: string;
  flag?: string;
  languages: string[];
  peakTimes: string;
  trustBadge: string;
  actionButtons: {
    video: string;
    audio: string;
    text: string;
  };
  description: string;
  faqs: Array<{ question: string; answer: string }>;
};

export const DIRECTORY_ITEMS: Record<string, DirectoryItem> = {
  "russia": {
    "slug": "russia",
    "title": "Анонимный видеочат и голосовой чат в России | Vidibro",
    "category": "country",
    "name": "Россия (Russia)",
    "flag": "🇷🇺",
    "languages": [
        "Русский (Russian)",
        "English"
    ],
    "peakTimes": "20:00 – 02:00 MSK",
    "trustBadge": "🟢 Активная очередь поиска",
    "actionButtons": {
        "video": "Начать видеочат",
        "audio": "Голосовой чат",
        "text": "Текстовый чат"
    },
    "description": "Общайтесь с людьми по всей России — от Москвы и Санкт-Петербурга до Новосибирска и Екатеринбурга. Vidibro — это современная платформа для анонимного видеочата, голосовых звонков и текстовых сообщений один на один. Вам не нужно регистрироваться, вводить номер телефона или создавать профиль.\n\nНаш сервис работает на основе прямого однорангового соединения WebRTC. Это означает, что ваши видео- и аудиопотоки передаются непосредственно между браузерами собеседников без хранения на сторонних серверах. Мы автоматически адаптируем битрейт до 600 кбит/с, чтобы видеочат работал плавно даже через мобильный 4G-интернет.\n\nЕсли во время общения вы столкнетесь с недопустимым поведением, нажмите кнопку «Красный флаг», чтобы мгновенно заблокировать пользователя и перейти к следующему собеседнику.",
    "faqs": [
        {
            "question": "Нужна ли регистрация для использования Vidibro в России?",
            "answer": "Нет, Vidibro абсолютно бесплатен и не требует создания аккаунта, ввода email или номера телефона."
        },
        {
            "question": "Безопасно ли мое видео и аудио?",
            "answer": "Да. Все звонки устанавливаются напрямую между браузерами через защищенный протокол WebRTC P2P. Видео не записывается и не сохраняется."
        },
        {
            "question": "Можно ли общаться только голосом без камеры?",
            "answer": "Конечно! Вы можете выбрать режим «Голосовой чат» для анонимного общения без включения видеокамеры."
        },
        {
            "question": "Как работает кнопка жалобы?",
            "answer": "Нажатие кнопки с красным флагом мгновенно завершает текущий звонок, блокирует собеседника и заново запускает поиск нового пользователя."
        }
    ]
},
  "russian-chat": {
    "slug": "russian-chat",
    "title": "Русский анонимный чат и голосовой поиск (Русский Язык)",
    "category": "language",
    "name": "Русский чат (Russian Chat)",
    "flag": "🇷🇺",
    "languages": [
        "Русский (Russian)"
    ],
    "peakTimes": "19:00 – 03:00 MSK",
    "trustBadge": "⚡ Прямое WebRTC соединение",
    "actionButtons": {
        "video": "Начать видеочат",
        "audio": "Голосовой чат",
        "text": "Текстовый чат"
    },
    "description": "Чат для русскоговорящих пользователей со всего мира. Знакомьтесь, практикуйте родной язык или находите интересных собеседников без необходимости регистрироваться.\n\nVidibro поддерживает три режима общения: видеовызов 1 на 1, анонимные голосовые звонки для интровертов и текстовый чат с подтверждением прочтения сообщений (галочки «✓✓»). Все соединение защищено шифрованием WebRTC P2P.",
    "faqs": [
        {
            "question": "Нужно ли скачивать приложение?",
            "answer": "Нет, Vidibro работает прямо в браузере вашего смартфона или компьютера."
        },
        {
            "question": "Работает ли чат на мобильном интернете?",
            "answer": "Да, система автоматически оптимизирует поток видео до 600 кбит/с для стабильной работы в сетях 4G/LTE."
        },
        {
            "question": "Можно ли переключать камеру на телефоне?",
            "answer": "Да, в видеочате доступна кнопка переключения между фронтальной и основной камерой."
        },
        {
            "question": "Как сохранить анонимность?",
            "answer": "Не сообщайте собеседникам свои личные данные, соцсети и фамилию."
        }
    ]
},
  "moscow": {
    "slug": "moscow",
    "title": "Чат с незнакомцами в Москве (Москва Чат 1 на 1) | Vidibro",
    "category": "city",
    "name": "Москва (Moscow)",
    "flag": "🇷🇺",
    "languages": [
        "Русский (Russian)",
        "English"
    ],
    "peakTimes": "20:00 – 02:00 MSK",
    "trustBadge": "🟢 Чат в Москве активен",
    "actionButtons": {
        "video": "Начать видеочат",
        "audio": "Голосовой чат",
        "text": "Текстовый чат"
    },
    "description": "Знакомьтесь с москвичами и жителями Подмосковья в анонимном видеочате 1 на 1. Быстрое P2P-соединение, нулевая регистрация и полная конфиденциальность.",
    "faqs": [
        {
            "question": "Бесплатен ли чат в Москве?",
            "answer": "Да, Vidibro на 100% бесплатен для всех пользователей."
        },
        {
            "question": "Нужна ли камера?",
            "answer": "Нет, вы можете использовать только голосовой чат."
        },
        {
            "question": "Как пожаловаться на нарушителя?",
            "answer": "Нажмите на кнопку с красным флагом для блокировки."
        },
        {
            "question": "Работает ли на iPhone и Android?",
            "answer": "Да, отлично работает в Safari и Chrome."
        }
    ]
},
  "saint-petersburg": {
    "slug": "saint-petersburg",
    "title": "Анонимный чат в Санкт-Петербурге (СПб Чат) | Vidibro",
    "category": "city",
    "name": "Санкт-Петербург (St. Petersburg)",
    "flag": "🇷🇺",
    "languages": [
        "Русский (Russian)",
        "English"
    ],
    "peakTimes": "20:00 – 02:00 MSK",
    "trustBadge": "🟢 Поиск в СПб активен",
    "actionButtons": {
        "video": "Начать видеочат",
        "audio": "Голосовой чат",
        "text": "Текстовый чат"
    },
    "description": "Общайтесь с петербуржцами в режиме реального времени. Анонимный видеочат, голосовые вызовы и текстовые сообщения без регистрации.",
    "faqs": [
        {
            "question": "Нужен ли профиль?",
            "answer": "Нет, регистрация не требуется."
        }
    ]
},
  "spain": {
    "slug": "spain",
    "title": "Chat de Video Aleatorio y Voz en España | Vidibro",
    "category": "country",
    "name": "España (Spain)",
    "flag": "🇪🇸",
    "languages": [
        "Español (Spanish)"
    ],
    "peakTimes": "21:00 – 02:00 CET",
    "trustBadge": "🟢 Cola de emparejamiento activa",
    "actionButtons": {
        "video": "Iniciar Videochat",
        "audio": "Chat de Voz",
        "text": "Chat de Texto"
    },
    "description": "Conéctate al instante con personas de toda España: Madrid, Barcelona, Valencia, Sevilla y más. Vidibro es la plataforma moderna de chat aleatorio en vivo 1 a 1 sin necesidad de registro ni descargas.\n\nTodas las transmisiones de vídeo y audio se realizan mediante conexión directa P2P WebRTC cifrada. Si encuentras un usuario inapropiado, pulsa el botón de Bandera Roja para bloquearlo al instante y emparejarte con un nuevo usuario.",
    "faqs": [
        {
            "question": "¿Es gratis usar Vidibro en España?",
            "answer": "Sí, Vidibro es 100% gratuito sin suscripciones ni necesidad de registro."
        },
        {
            "question": "¿Se guardan las videollamadas?",
            "answer": "No. Las llamadas son directas entre navegadores (P2P WebRTC) y no se graban ni almacenan."
        },
        {
            "question": "¿Puedo usar solo voz sin cámara?",
            "answer": "Sí, puedes seleccionar el modo 'Chat de Voz' para hablar de forma anónima sin cámara."
        },
        {
            "question": "¿Cómo funciona el bloqueo de usuarios?",
            "answer": "El botón de Bandera Roja bloquea de inmediato al usuario reportado y busca una nueva persona."
        }
    ]
},
  "spanish-chat": {
    "slug": "spanish-chat",
    "title": "Chat Aleatorio en Español con Desconocidos | Vidibro",
    "category": "language",
    "name": "Chat en Español (Spanish Chat)",
    "flag": "🇪🇸",
    "languages": [
        "Español (Spanish)"
    ],
    "peakTimes": "20:00 – 03:00 CET / CST",
    "trustBadge": "⚡ Conexión P2P Cifrada",
    "actionButtons": {
        "video": "Iniciar Videochat",
        "audio": "Chat de Voz",
        "text": "Chat de Texto"
    },
    "description": "Habla con hispanohablantes de España y Latinoamérica (México, Colombia, Argentina, Chile). Vidibro ofrece emparejamiento instantáneo por vídeo, voz y texto con avisos de lectura tipo WhatsApp.",
    "faqs": [
        {
            "question": "¿Requiere instalar aplicaciones?",
            "answer": "No, funciona directamente en cualquier navegador móvil o de escritorio."
        },
        {
            "question": "¿Es compatible con conexiones móviles 4G?",
            "answer": "Sí, cuenta con control de tasa de bits adaptativo (máx 600 kbps) para evitar cortes."
        },
        {
            "question": "¿Es anónimo?",
            "answer": "100% anónimo. No solicitamos correo ni número de teléfono."
        },
        {
            "question": "¿Puedo cambiar de cámara en el móvil?",
            "answer": "Sí, dispone de botón para alternar entre cámara frontal y trasera."
        }
    ]
},
  "madrid": {
    "slug": "madrid",
    "title": "Chat de Video Aleatorio en Madrid | Vidibro",
    "category": "city",
    "name": "Madrid",
    "flag": "🇪🇸",
    "languages": [
        "Español (Spanish)"
    ],
    "peakTimes": "21:00 – 02:00 CET",
    "trustBadge": "🟢 Chat en Madrid activo",
    "actionButtons": {
        "video": "Iniciar Videochat",
        "audio": "Chat de Voz",
        "text": "Chat de Texto"
    },
    "description": "Conecta con madrileños en videochat 1 a 1 sin registro. Conexión rápida cifrada y anonimato total.",
    "faqs": [
        {
            "question": "¿Es gratis en Madrid?",
            "answer": "Sí, 100% gratis sin cuenta."
        }
    ]
},
  "germany": {
    "slug": "germany",
    "title": "Kostenloser Anonymer Videochat in Deutschland | Vidibro",
    "category": "country",
    "name": "Deutschland (Germany)",
    "flag": "🇩🇪",
    "languages": [
        "Deutsch (German)",
        "English"
    ],
    "peakTimes": "20:00 – 01:00 CET",
    "trustBadge": "🟢 Aktive Match-Warteschlange",
    "actionButtons": {
        "video": "Videochat Starten",
        "audio": "Sprachchat",
        "text": "Textchat"
    },
    "description": "Triff neue Leute in ganz Deutschland — Berlin, München, Hamburg und Köln. Vidibro bietet schnellen, anonymen 1-zu-1 Videochat, Sprachverbindungen und Textnachrichten ohne Registrierung.\n\nDirekte WebRTC P2P-Verschlüsselung sorgt dafür, dass deine Medienströme privat bleiben und nicht auf Servern gespeichert werden.",
    "faqs": [
        {
            "question": "Ist Vidibro in Deutschland kostenlos?",
            "answer": "Ja, Vidibro ist zu 100% kostenlos ohne Abonnements oder Registrierungszwang."
        },
        {
            "question": "Wie wird meine Privatsphäre geschützt?",
            "answer": "Über direkte WebRTC P2P-Verbindungen ohne Speicherung von Mediendaten."
        },
        {
            "question": "Gibt es Sprachchat ohne Kamera?",
            "answer": "Ja, du kannst den Sprachchat-Modus wählen, um ohne Kamera zu telefonieren."
        },
        {
            "question": "Wie melde ich unangemessene Nutzer?",
            "answer": "Klicke einfach auf den Roten Flaggen-Button, um den Nutzer zu blockieren und neu zu matchen."
        }
    ]
},
  "german-chat": {
    "slug": "german-chat",
    "title": "Deutscher Anonymer Video- & Sprachchat | Vidibro",
    "category": "language",
    "name": "Deutscher Chat (German Chat)",
    "flag": "🇩🇪",
    "languages": [
        "Deutsch (German)"
    ],
    "peakTimes": "19:00 – 02:00 CET",
    "trustBadge": "⚡ WebRTC P2P Verschlüsselt",
    "actionButtons": {
        "video": "Videochat Starten",
        "audio": "Sprachchat",
        "text": "Textchat"
    },
    "description": "Kostenloser Zufalls-Chat für Deutschsprachige weltweit. Nutze Videochat, Sprachverbindungen oder Textnachrichten mit Lesebestätigungen (✓✓).",
    "faqs": [
        {
            "question": "Muss ich eine App herunterladen?",
            "answer": "Nein, Vidibro läuft direkt im mobilen oder Desktop-Browser."
        },
        {
            "question": "Funktioniert es unterwegs mit 4G?",
            "answer": "Ja, mit automatischer Bitratenbegrenzung auf 600 kbps für stabile Mobile-Streams."
        },
        {
            "question": "Kann ich die Kamera am Handy wechseln?",
            "answer": "Ja, du kannst während des Chats zwischen Front- und Hauptkamera umschalten."
        },
        {
            "question": "Bleibe ich anonym?",
            "answer": "Ja, es werden keine persönlichen Daten erhoben."
        }
    ]
},
  "france": {
    "slug": "france",
    "title": "Chat Vidéo Aléatoire Gratuit en France | Vidibro",
    "category": "country",
    "name": "France",
    "flag": "🇫🇷",
    "languages": [
        "Français (French)",
        "English"
    ],
    "peakTimes": "20:00 – 01:00 CET",
    "trustBadge": "🟢 File d'attente active",
    "actionButtons": {
        "video": "Lancer le Chat Vidéo",
        "audio": "Chat Vocal",
        "text": "Chat Texte"
    },
    "description": "Rencontrez des personnes en France (Paris, Lyon, Marseille). Vidibro propose un chat vidéo, vocal et texte 1 contre 1 sans inscription ni téléchargement.",
    "faqs": [
        {
            "question": "Est-ce gratuit en France?",
            "answer": "Oui, Vidibro est 100% gratuit sans inscription."
        },
        {
            "question": "Mes appels sont-ils privés?",
            "answer": "Oui, les flux utilisent le chiffrement direct P2P WebRTC."
        },
        {
            "question": "Puis-je utiliser la voix seule?",
            "answer": "Oui, le mode Chat Vocal permet de discuter sans caméra."
        },
        {
            "question": "Comment signaler un utilisateur?",
            "answer": "Cliquez sur le bouton Drapeau Rouge pour bloquer et zapper l'utilisateur."
        }
    ]
},
  "japan": {
    "slug": "japan",
    "title": "日本向け無料ランダムビデオチャット・音声通話 | Vidibro",
    "category": "country",
    "name": "日本 (Japan)",
    "flag": "🇯🇵",
    "languages": [
        "日本語 (Japanese)",
        "English"
    ],
    "peakTimes": "21:00 – 02:00 JST",
    "trustBadge": "🟢 マッチング待機中",
    "actionButtons": {
        "video": "ビデオチャットを開始",
        "audio": "音声チャット",
        "text": "テキストチャット"
    },
    "description": "東京、大阪、名古屋など、日本全国の人々と匿名でランダムに1対1のビデオ通話や音声チャットが楽しめます。会員登録やアプリのダウンロードは一切不要です。\n\nP2P WebRTCによる直接暗号化通信を採用しているため、通話内容がサーバーに保存されることはありません。",
    "faqs": [
        {
            "question": "Vidibroは無料で利用できますか？",
            "answer": "はい、会員登録や課金要素は一切なく、完全無料でご利用いただけます。"
        },
        {
            "question": "カメラなしの音声通話は可能ですか？",
            "answer": "はい、「音声チャット」モードを選択すれば、顔出しなしで会話を楽しめます。"
        },
        {
            "question": "スマホのカメラ切替はできますか？",
            "answer": "はい、通話画面のボタンでインカメラとアウトカメラを切り替えられます。"
        },
        {
            "question": "通報機能はありますか？",
            "answer": "赤い旗のボタンを押すと、相手を即座にブロックして次のユーザーと接続します。"
        }
    ]
},
  "india": {
    "slug": "india",
    "title": "भारत में मुफ्त रैंडम वीडियो और वॉइस चैट | Vidibro",
    "category": "country",
    "name": "भारत (India)",
    "flag": "🇮🇳",
    "languages": [
        "हिंदी (Hindi)",
        "English",
        "বাংলা",
        "தமிழ்"
    ],
    "peakTimes": "21:00 – 02:00 IST",
    "trustBadge": "🟢 एक्टिव मैचिंग कतार",
    "actionButtons": {
        "video": "वीडियो चैट शुरू करें",
        "audio": "वॉइस चैट",
        "text": "टेक्स्ट चैट"
    },
    "description": "मुंबई, दिल्ली, बेंगलुरु, कोलकाता और पूरे भारत के लोगों से तुरंत जुड़ें। Vidibro बिना किसी रजिस्ट्रेशन या ऐप डाउनलोड के मुफ्त 1-ऑन-1 वीडियो कॉल, वॉइस चैट और टेक्स्ट मैसेजिंग प्रदान करता है।",
    "faqs": [
        {
            "question": "क्या Vidibro भारत में मुफ्त है?",
            "answer": "हां, Vidibro 100% मुफ्त है और इसके लिए किसी अकाउंट की जरूरत नहीं है।"
        },
        {
            "question": "क्या मैं बिना कैमरा के वॉइस चैट कर सकता हूं?",
            "answer": "जी हां, आप 'वॉइस चैट' मोड चुनकर बिना चेहरा दिखाए बात कर सकते हैं।"
        },
        {
            "question": "क्या यह 4G नेटवर्क पर काम करता है?",
            "answer": "हां, यह मोबाइल डेटा पर स्मूथ चलने के लिए ऑप्टिमाइज्ड है।"
        },
        {
            "question": "गलत व्यवहार करने वाले यूजर को कैसे रिपोर्ट करें?",
            "answer": "रेड फ्लैग बटन दबाकर आप तुरंत यूजर को ब्लॉक और रिपोर्ट कर सकते हैं।"
        }
    ]
},
  "hindi-chat": {
    "slug": "hindi-chat",
    "title": "हिंदी में रैंडम वीडियो और वॉइस चैट (Hindi Chat) | Vidibro",
    "category": "language",
    "name": "हिंदी चैट (Hindi Chat)",
    "flag": "🇮🇳",
    "languages": [
        "हिंदी (Hindi)"
    ],
    "peakTimes": "20:00 – 02:00 IST",
    "trustBadge": "⚡ सुरक्षित WebRTC कनेक्शन",
    "actionButtons": {
        "video": "वीडियो चैट शुरू करें",
        "audio": "वॉइस चैट",
        "text": "टेक्स्ट चैट"
    },
    "description": "दुनिया भर के हिंदी भाषियों से जुड़ें। 1-ऑन-1 वीडियो मैच, बिना चेहरा दिखाए वॉइस कॉल और मैसेजिंग।",
    "faqs": [
        {
            "question": "क्या ऐप डाउनलोड करना जरूरी है?",
            "answer": "नहीं, यह सीधे मोबाइल या कंप्यूटर ब्राउज़र में चलता है।"
        },
        {
            "question": "क्या मेरी गोपनीयता सुरक्षित है?",
            "answer": "हां, सभी कॉल P2P एन्क्रिप्टेड हैं।"
        },
        {
            "question": "क्या मैं कैमरा फ्लिप कर सकता हूं?",
            "answer": "हां, मोबाइल में फ्रंट और बैक कैमरा स्विच करने का विकल्प मौजूद है।"
        },
        {
            "question": "क्या टेक्स्ट चैट में रीड रिसीप्ट मिलती है?",
            "answer": "हां, व्हाट्सएप की तरह नीले टिक (✓✓) दिखाई देते हैं।"
        }
    ]
},
  "united-states": {
    "slug": "united-states",
    "title": "Talk to Strangers in USA (Free 1-on-1 Video & Voice Match)",
    "category": "country",
    "name": "United States",
    "flag": "🇺🇸",
    "languages": [
        "English",
        "Spanish"
    ],
    "peakTimes": "8 PM – 1 AM EST / PST",
    "trustBadge": "🟢 Active Match Queue",
    "actionButtons": {
        "video": "Start Video Match",
        "audio": "Voice Chat",
        "text": "Text Chat"
    },
    "description": "Looking to meet people across the US? Vidibro connects you instantly with strangers in New York, California, Texas, and across the United States for 1-on-1 video call, voice chat, and text messaging.\n\nEnjoy anonymous, zero-login video matching with adaptive 600 kbps bitrate capping that keeps streams clear even on mobile 4G/5G connections.",
    "faqs": [
        {
            "question": "Is Vidibro popular in the United States?",
            "answer": "Yes, the US is one of Vidibro's largest active regions with active matching 24/7."
        },
        {
            "question": "Do I need to enter a credit card or phone number?",
            "answer": "Never. Vidibro requires zero personal data, zero credit cards, and zero registration."
        },
        {
            "question": "How does user moderation work?",
            "answer": "Vidibro features a 1-tap Red Flag report button that immediately blocks abusive users."
        },
        {
            "question": "Can I use voice chat without camera?",
            "answer": "Yes, Voice Chat mode allows faceless audio calls."
        }
    ]
},
  "english-chat": {
    "slug": "english-chat",
    "title": "Global English Random Chat with Strangers | Vidibro",
    "category": "language",
    "name": "English Chat",
    "flag": "🌐",
    "languages": [
        "English"
    ],
    "peakTimes": "24/7 Global Activity",
    "trustBadge": "⚡ Instant WebRTC Connection",
    "actionButtons": {
        "video": "Start Video Match",
        "audio": "Voice Chat",
        "text": "Text Chat"
    },
    "description": "Connect with native and fluent English speakers worldwide for instant 1-on-1 video, audio, and text chat.",
    "faqs": [
        {
            "question": "Is English chat available 24/7?",
            "answer": "Yes, English is active around the clock across all timezones."
        },
        {
            "question": "Is signup required?",
            "answer": "No signup required."
        },
        {
            "question": "Is WebRTC encrypted?",
            "answer": "Yes, all audio/video streams use direct P2P encryption."
        },
        {
            "question": "How do I skip to next stranger?",
            "answer": "Click the Skip button anytime to match with a new person."
        }
    ]
},
  "united-kingdom": {
    "slug": "united-kingdom",
    "title": "Talk to Strangers in UK (Free Stranger Video Call & Voice)",
    "category": "country",
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "languages": [
        "English"
    ],
    "peakTimes": "7 PM – 12 AM GMT",
    "trustBadge": "🟢 Active Match Queue",
    "actionButtons": {
        "video": "Start Video Match",
        "audio": "Voice Chat",
        "text": "Text Chat"
    },
    "description": "Meet people across London, Manchester, Edinburgh, and the UK. Vidibro pairs you instantly for 1-on-1 video chat, voice calls, and text with zero account creation.",
    "faqs": [
        {
            "question": "Is Vidibro free in the UK?",
            "answer": "Yes, Vidibro is completely free for all UK users with zero hidden fees."
        },
        {
            "question": "Is signup required?",
            "answer": "No, launch video or voice chat instantly."
        },
        {
            "question": "Can I flip my camera on mobile?",
            "answer": "Yes, seamless mobile camera flip is supported."
        },
        {
            "question": "How to report bad behavior?",
            "answer": "Tap the Red Flag button to block and match again."
        }
    ]
}
};

export function getDirectoryItem(slug: string): DirectoryItem | undefined {
  return DIRECTORY_ITEMS[slug];
}

export function getAllDirectorySlugs(): string[] {
  return Object.keys(DIRECTORY_ITEMS);
}
