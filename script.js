body {
    margin: 0;
    padding: 0;
    font-family: 'Courier New', Courier, monospace;
    background-color: #050505;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding-top: 40px;
}

/* Navigasi Atas */
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    max-width: 600px;
    margin-bottom: 30px;
}

.logo-circle {
    width: 60px;
    height: 60px;
    border: 2px solid #00ff88;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-text {
    color: #00ff88;
    font-weight: bold;
    font-size: 12px;
}

/* Desain Tombol Wallet */
.connect-btn {
    background-color: #00ff88;
    color: #050505;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
    cursor: pointer;
    transition: all 0.3s ease;
}

.connect-btn:hover {
    background-color: #00cc6a;
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}

/* Kotak Konten Utama */
.container {
    background-color: #111111;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
    border: 1px solid #222;
    width: 90%;
    max-width: 600px;
    text-align: center;
}

h1 {
    color: #ffffff;
    margin-bottom: 5px;
    font-size: 24px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.subtitle {
    color: #888;
    margin-bottom: 30px;
    font-size: 14px;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #333;
}

th {
    color: #00ff88;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
}

td {
    font-size: 14px;
}

tbody tr:hover {
    background-color: #1a1a1a;
    transition: background-color 0.2s ease;
}

.wallet {
    color: #aaa;
    background-color: #222;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}
