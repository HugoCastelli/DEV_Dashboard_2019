basicWidget = {
    "ffAdSQds": {
        "name": "current_weather",
        "description": "Afficher la meteo dans une ville choisie",
        "id": "ffAdSQds",
        "params": {
            "city": "Montpellier",
            "time": 60
        },
        "position": {
            "cols": 2,
            "rows": 1,
            "x": 0,
            "y": 0,
        },
    }
}


About = {
    "customer": {
        "host": "none"
    },
    "server": {
        "current_time": 0,
        "services": [{
            "name": "weather",
            "widgets": [{
                "name": "current_weather",
                "description": "Affiche la meteo actuelle dans une ville choisie",
                "params": [{
                    "name": "city",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            },{
                "name": "forecast_weather",
                "description": "Affiche la prévision météorologique d'une ville choisie",
                "params": [{
                    "name": "city",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            }]
        },{
            "name": "cryptocurrencies",
            "widgets": [{
                "name": "crypto_actual_value",
                "description": "Afficher les la valeur d'une cryptomonaie choisie dans la monaie choisie",
                "params": [{
                    "name": "crypto_currency",
                    "type": "string"
                },{
                    "name": "currency",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            },{
                "name": "crypto_actual_worth",
                "description": "Afficher les la capitalisation d'une cryptomonaie choisie dans la monaie choisie",
                "params": [{
                    "name": "crypto_currency",
                    "type": "string"
                },{
                    "name": "currency",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            }]
        },{
            "name": "yammer",
            "widgets": [{
                "name": "group_messages",
                "description": "Afficher les message d'un groupe yammer",
                "params": [{
                    "name": "group_id",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            },{
                "name": "thread_messages",
                "description": "Afficher les message d'un thread yammer",
                "params": [{
                    "name": "thread_id",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            }]
        },{
            "name": "epitech_intranet",
            "widgets": [{
                "name": "intra_modules",
                "description": "Afficher les modules inscrits/non inscrits",
                "params": [{
                    "name": "subscribed",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            },{
                "name": "intra_infos",
                "description": "Afficher les infos du profil intra",
                "params": [{
                    "name": "info_type",
                    "type": "string"
                },{
                    "name": "time",
                    "type": "int"
                }]
            }]
        },{
            "name": "github",
            "widgets": [{
                "name": "repo_commits",
                "description": "Afficher les commits d'un repo choisis",
                "params": [{
                    "name": "repo",
                    "type": "string"
                },{
                    "name": "repo_owner",
                    "type": "string"
                }, {
                    "name": "time",
                    "type": "int"
                }]
            }, {
                "name": "repo_issues",
                "description": "Afficher les issues d'un repo choisis",
                "params": [{
                    "name": "repo",
                    "type": "string"
                },{
                    "name": "repo_owner",
                    "type": "string"
                }, {
                    "name": "time",
                    "type": "int"
                }]
            }]
        },{
            "name": "trello",
            "widgets": [{
                "name": "trello_board",
                "description": "Afficher un tableau choisis",
                "params": [{
                    "name": "board_id",
                    "type": "string"
                }, {
                    "name": "time",
                    "type": "int"
                }]
            }, {
                "name": "trello_member_tasks",
                "description": "Afficher les tache d'un membre choisis dans un tableau choisis",
                "params": [{
                    "name": "board_id",
                    "type": "string"
                },{
                    "name": "member_id",
                    "type": "string"
                }, {
                    "name": "time",
                    "type": "int"
                }]
            }]
        },{
            "name": "air_quality",
            "widgets": [{
                "name": "air_quality",
                "description": "Afficher la qualite de l'air d'une ville choisie",
                "params": [{
                    "name": "city",
                    "type": "string"
                }, {
                    "name": "time",
                    "type": "int"
                }]
            }]
        }]
    }
}
