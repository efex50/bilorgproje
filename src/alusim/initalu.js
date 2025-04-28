import { html, render } from "lit";
import './style.css'
import Alu from "./alju";

export function initAlu(){
  let app =   html`
  <div id="aluapp-main" class="aluapp-main">
     <h1>CPU - ALU - Cache - RAM Simülasyonu</h1>
    <!-- İki Sayı Girişi -->
     <div class="form-container">
    <div class="selector">
        <label for="input1">1. Sayı:</label>
        <input type="number" id="input1">
      </div>
    
      <div class="selector">
        <label for="input2">2. Sayı:</label>
        <input type="number" id="input2">
      </div>

  <!-- ALU İşlemi Seçimi -->
  <div class="selector">
    <label for="operation">ALU İşlemi Seçin:</label>
    <select id="operation">
      <option value="ADD">Toplama</option>
      <option value="SUB">Çıkarma</option>
      <option value="MUL">Çarpma</option>
      <option value="DIV">Bölme</option>
      <option value="AND">AND</option>
      <option value="OR">OR</option>
      <option value="NOT">NOT</option>
    </select>
  </div>
  <!--Ram boyutlandırma-->
  <div class="selector">
    <label for="ram-size">RAM Boyutu Seçin:</label>
    <select id="ram-size">
      <option value="4" selected>4 Blok</option>
      <option value="8">8 Blok</option>
      <option value="12">12 Blok</option>
      <option value="16">16 Blok</option>
    </select>
  </div>
  

  <!-- FIFO / LRU Seçimi -->
  <div class="selector">
    <label for="cache-policy">Cache Politikası Seçin:</label>
    <select id="cache-policy">
      <option value="FIFO">FIFO</option>
      <option value="LRU">LRU</option>
    </select>
  </div>

  <!-- Başlat Butonu -->
  <div class="selector">
    <button id="start-btn">İşlemi Başlat</button>
  </div>
</div>

  <!-- Ana İşlem Aşamaları -->
  <div class="container">
    <div class="unit" id="cpu">CPU</div>
    <div class="line">
      <div class="data" id="data"></div>
    </div>
    <div class="unit" id="alu">ALU</div>
    <div class="line"></div>
    <div class="unit" id="cache">Cache</div>
    <div class="line"></div>
    <div class="unit" id="ram">RAM</div>
  </div>

  <!-- Durum Bilgileri -->
  <div class="status-text" id="status">Başlıyor...</div>
  <div class="alu-ops" id="alu-ops">ALU İşlemi Bekleniyor...</div>

  <!-- Cache Blokları -->
  <div class="section">
    <h2>Cache Blokları</h2>
    <div class="cache-blocks" id="cache-blocks">
      <div class="block">A</div>
      <div class="block">B</div>
      <div class="block">C</div>
      <div class="block">D</div>
    </div>
  </div>

  <!-- RAM Blokları -->
  <div class="section">
    <h2>RAM Blokları</h2>
    <div class="ram-blocks" id="ram-blocks">
      <div class="block">1</div>
      <div class="block">2</div>
      <div class="block">3</div>
      <div class="block">4</div>
    </div>
  </div>
  </div>
  <script src="/aluscript.js"></script>
  `
  console.log();
  
  render(app, document.querySelector("#app"));
  Alu()
}