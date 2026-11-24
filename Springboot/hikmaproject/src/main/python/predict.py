import sys
import joblib
import pandas as pd
import json

# Arguments depuis Java : quantite_disponible, besoin_mensuel
quantite_disponible = float(sys.argv[1])
besoin_mensuel = float(sys.argv[2])

# Charger le modèle
model = joblib.load("C:/Users/LENOVO/Desktop/mrpval/Springboot/hikmaproject/src/main/python/model/model.joblib")
# Créer un DataFrame avec les colonnes attendues par le modèle
data = pd.DataFrame([[quantite_disponible, besoin_mensuel]],
                   columns=["quantite_disponible", "besoin_mensuel"])

# Faire la prédiction
prediction = model.predict(data)[0]

# Obtenir les probabilités pour chaque classe
proba = model.predict_proba(data)[0]

# Mapping des actions en fonction de la prédiction
actions = {
    0: "Aucune action",
    1: "Commander plus",
    2: "Réduire le stock",
    3: "Optimiser les commandes"
}

# Créer l'analyse
if besoin_mensuel == 0:
    ratio = float('inf')  # Cas où il n'y a pas de besoin
else:
    ratio = quantite_disponible / besoin_mensuel  # Ratio de couverture du stock

analyse = ""
if prediction == 0:
    analyse = f"Le stock actuel de {quantite_disponible} unités est adéquat par rapport au besoin mensuel de {besoin_mensuel} unités. Aucune action n'est nécessaire."
elif prediction == 1:
    analyse = f"Stock insuffisant ({quantite_disponible} unités) pour couvrir le besoin mensuel de {besoin_mensuel} unités. Il est recommandé d'augmenter le stock."
elif prediction == 2:
    analyse = f"Stock excessif ({quantite_disponible} unités) par rapport au besoin mensuel de {besoin_mensuel} unités. Une réduction du stock est conseillée."
elif prediction == 3:
    analyse = f"Le ratio de couverture est de {ratio:.2f} mois. Une optimisation des commandes est recommandée pour maintenir un niveau de stock optimal."

# Créer un objet JSON avec l'action et l'analyse
result = {
    "action": actions[prediction],
    "analyse": analyse,
    "confidence": float(max(proba) * 100)  # Confiance en pourcentage
}

# Renvoyer le résultat au format JSON
print(json.dumps(result))