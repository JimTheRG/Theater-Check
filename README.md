# Theater Seat Booking Application

##  Στόχος Εφαρμογής
Η εφαρμογή "Theater Check" είναι ένα ολοκληρωμένο κατανεμημένο σύστημα που επιτρέπει στους χρήστες να περιηγούνται σε θεατρικές παραστάσεις, να βλέπουν διαθέσιμες ώρες και να πραγματοποιούν κρατήσεις συγκεκριμένων θέσεων σε πραγματικό χρόνο.

##  Αρχιτεκτονική Συστήματος (System Architecture)
Η εφαρμογή ακολουθεί το μοντέλο **Client-Server**:
1.  **Frontend (Mobile/Web Client)**: Αναπτύχθηκε με **React Native (Expo)**. Επικοινωνεί με το Backend μέσω REST API και διαχειρίζεται την αυθεντικοποίηση μέσω **JWT Tokens**.
2.  **Backend (REST API)**: Αναπτύχθηκε με **Node.js & Express**. Διαχειρίζεται το επιχειρησιακό κομμάτι (Business Logic), την ασφάλεια (JWT Verification) και την επικοινωνία με τη βάση δεδομένων.
3.  **Database (MariaDB)**: Σχεσιακή βάση δεδομένων που αποθηκεύει χρήστες, θέατρα, παραστάσεις και κρατήσεις, διασφαλίζοντας την ακεραιότητα των δεδομένων με τη χρήση Primary & Foreign Keys.

##  Τεχνολογίες
- **Frontend**: React Native, React Navigation, Axios, React Native Paper.
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), Bcrypt.js (Hashing).
- **Database**: MariaDB / MySQL (μέσω XAMPP).

##  Οδηγίες Εγκατάστασης & Εκτέλεσης

### 1. Προετοιμασία Βάσης Δεδομένων
1. Ξεκινήστε το **Apache** και το **MySQL** μέσω του **XAMPP Control Panel**.
2. Πατήστε το κουμπί **Admin** δίπλα στο MySQL για να ανοίξει το phpMyAdmin.
3. Δημιουργήστε μια νέα βάση δεδομένων με όνομα `theater_booking`.
4. Εισάγετε (Import) το αρχείο `database/schema.sql` για να δημιουργηθούν αυτόματα οι πίνακες και τα δεδομένα.

### 2. Εκτέλεση Backend (Server)
1. Ανοίξτε ένα νέο παράθυρο **PowerShell** ή **Command Prompt**.
2. Μεταβείτε στον φάκελο του backend με την εντολη cd
   
3. Εγκαταστήστε τις απαραίτητες βιβλιοθήκες (την πρώτη φορά μόνο):
   ```powershell
   npm install
   ```
4. Ξεκινήστε τον server:
   ```powershell
   npm start
   ```
   *Πρέπει να δείτε το μήνυμα: "Server running on port 3000". Μην κλείσετε αυτό το παράθυρο.*

### 3. Εκτέλεση Frontend (Application)
1. Ανοίξτε ένα **δεύτερο, ξεχωριστό παράθυρο PowerShell**.
2. Μεταβείτε στον φάκελο του frontend με την εντολη cd
   
3. Εγκαταστήστε τις βιβλιοθήκες:
   ```powershell
   npm install
   ```
4. Ξεκινήστε την εφαρμογή στον browser:
   ```powershell
   npx expo start --web
   ```
   *Η εφαρμογή θα ανοίξει αυτόματα στη διεύθυνση http://localhost:19006/ ή http://localhost:8081/.*

5. Για χρήση απο κινητό χρησιμποιήστε την εφαρμογή expo go και κάνετε scan στο qr code που θα σας εμφανίσει το power shell.

##  Διαπιστευτήρια Demo (Emergency Login)
Για γρήγορη δοκιμή χωρίς εγγραφή:
- **Email**: admin
- **Password**: admin
