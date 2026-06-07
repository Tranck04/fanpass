# FanID — OCR/MRZ + Verrouillage des données

## Objectif

Utiliser la zone MRZ (Machine Readable Zone) des passeports et cartes d'identité pour :

1. Extraire automatiquement les données (nom, prénom, nationalité, date de naissance, numéro de document)
2. Verrouiller ces champs une fois le FanID vérifié
3. Laisser modifiables les préférences (langue, équipe, profil fan, téléphone)

---

## 1. Flux FanID avec MRZ

```
Fan → Profile → Créer Fan ID
  → Scanner/photo du document (passeport ou CIN)
  → OCR extrait la zone MRZ
  → Parsing MRZ → données extraites (nom, nationalité, n° doc, date naissance)
  → Le fan vérifie les données
  → Confirme → FanID vérifié
  → Champs verrouillés (nom, prénom, nationalité, n° doc, date naissance)
  → Champs modifiables (téléphone, langue, équipe, profil fan, photo)
```

---

## 2. Backend — Nouveaux éléments

### 2.1 Dépendances Python

```
passporteye          # Détection + extraction MRZ depuis image
mrz                  # Parsing des lignes MRZ (TD1, TD2, TD3)
pytesseract          # OCR fallback
Pillow               # Traitement d'image
```

### 2.2 Nouveaux champs dans `models.py` — table `fan`

```python
# Champs verrouillés après vérification FanID
first_name_locked = Column(Boolean, default=False)
last_name_locked = Column(Boolean, default=False)
nationality_locked = Column(Boolean, default=False)
document_number_locked = Column(Boolean, default=False)

# Données extraites du MRZ
date_of_birth = Column(String, nullable=True)  # extrait du MRZ
mrz_raw = Column(Text, nullable=True)            # lignes MRZ brutes
```

### 2.3 Nouvel endpoint : `POST /api/auth/fanid/scan-mrz`

```python
# Reçoit une image (multipart/form-data)
# → Détecte la zone MRZ via passporteye
# → Parse les lignes MRZ
# → Extrait : first_name, last_name, nationality, document_number, date_of_birth
# → Retourne les données extraites (le fan peut les vérifier avant confirmation)
# → Ne stocke rien encore — le fan doit confirmer

Response:
{
  "first_name": "YASSINE",
  "last_name": "ATLAS",
  "nationality": "MAR",
  "document_number": "AB1234567",
  "document_type": "passport",  # TD3
  "date_of_birth": "1990-05-15",
  "mrz_confidence": 0.98
}
```

### 2.4 Mise à jour : `POST /api/auth/fanid/verify`

```python
# Après scan MRZ, le fan confirme les données
# → Met à jour fan avec les données extraites
# → Verrouille les champs (first_name_locked = True, etc.)
# → Passe fan_id_status à "verified"
```

---

## 3. Frontend — Modifications

### 3.1 Mise à jour de `FanIdVerification` dans [`ProfileView.tsx`](src/components/fanpass/profile/ProfileView.tsx)

Flux actuel → Flux MRZ :

| Étape actuelle                           | Nouvelle étape                           |
| ---------------------------------------- | ---------------------------------------- |
| Choix type document + saisie manuelle n° | **Scanner/photo du document**            |
| Saisie manuelle                          | **Extraction automatique MRZ**           |
| Confirmation                             | **Vérification visuelle + confirmation** |
| -                                        | **Verrouillage des champs**              |

### 3.2 Profil — champs verrouillés

Dans l'écran d'édition du profil :

- `first_name`, `last_name`, `nationality`, `document_number` → grisés + cadenas 🔒
- `phone`, `language`, `supported_team`, `fan_profile` → modifiables

### 3.3 Badge visuel

Après vérification MRZ, le profil affiche :

```
🔒 Fan ID vérifié par MRZ
   Nom: YASSINE ATLAS
   Nationalité: Marocaine
   Document: AB1234567
   Valide jusqu'au: 14/07/2031
```

---

## 4. Format MRZ supporté

| Type | Document         | Format                   | Lignes |
| ---- | ---------------- | ------------------------ | ------ |
| TD1  | Carte d'identité | 3 lignes × 30 caractères | 3      |
| TD2  | Carte de séjour  | 2 lignes × 36 caractères | 2      |
| TD3  | Passeport        | 2 lignes × 44 caractères | 2      |

Exemple MRZ passeport (TD3) :

```
P<MARATLAS<<YASSINE<<<<<<<<<<<<<<<<<<<<<<<<
AB1234567MAR9005151M1407156<<<<<<<<<<<<<<04
```

Parsé → `first_name: YASSINE`, `last_name: ATLAS`, `nationality: MAR`, `doc_number: AB1234567`, `dob: 1990-05-15`

---

## 5. Ordre d'implémentation

| #   | Tâche                                                          | Fichier(s)                        |
| --- | -------------------------------------------------------------- | --------------------------------- |
| 1   | Ajouter `passporteye`, `mrz` aux dépendances                   | `requirements.txt`                |
| 2   | Ajouter champs `_locked` + `date_of_birth` + `mrz_raw`         | `models.py`, `schemas.py`         |
| 3   | Créer endpoint `POST /api/auth/fanid/scan-mrz`                 | `auth.py` (ou nouveau `fanid.py`) |
| 4   | Mettre à jour `POST /api/auth/fanid/verify`                    | `auth.py`                         |
| 5   | Mettre à jour `FanIdVerification` (scan photo → MRZ → confirm) | `ProfileView.tsx`                 |
| 6   | Verrouiller champs dans l'édition du profil                    | `ProfileView.tsx`                 |
| 7   | Vérification compilation                                       | -                                 |
