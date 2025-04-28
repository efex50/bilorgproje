export default function Alu() {
    document.addEventListener('DOMContentLoaded', () => {
        createCacheBlocks();
        createRAMBlocks();
      });
      
      document.getElementById('ram-size').addEventListener('change', createRAMBlocks);
           // --- HTML Üzerinden Elementleri Seçiyoruz ---
      const statusText = document.getElementById('status');
      const aluOps = document.getElementById('alu-ops');
      const operationSelect = document.getElementById('operation');
      const policySelect = document.getElementById('cache-policy');
      const cpu = document.getElementById('cpu');
      const alu = document.getElementById('alu');
      const cache = document.getElementById('cache');
      const ram = document.getElementById('ram');
      const cacheBlocks = document.querySelectorAll('.cache-blocks .block');
      const ramBlocks = document.querySelectorAll('.ram-blocks .block');
      
      //Sayı girdileri
      document.getElementById('start-btn').addEventListener('click', () => {
          const input1 = parseFloat(document.getElementById('input1').value);
          const input2 = parseFloat(document.getElementById('input2').value);
          const operation = document.getElementById('operation').value;
          const cachePolicy = document.getElementById('cache-policy').value;
        
          let result;
        
          switch (operation) {
            case 'ADD':
              result = input1 + input2;
              break;
            case 'SUB':
              result = input1 - input2;
              break;
            case 'MUL':
              result = input1 * input2;
              break;
            case 'DIV':
              result = input1 / input2;
              break;
            case 'AND':
              result = input1 & input2;
              break;
            case 'OR':
              result = input1 | input2;
              break;
            case 'NOT':
              result = ~input1; // NOT sadece bir değer üzerinde çalışır
              break;
            default:
              result = "Hatalı işlem!";
          }
        
          // İşlem sonuçlarını gösterelim
          document.getElementById('status').textContent = `CPU veriyi aldı: ${input1} ve ${input2}`;
          setTimeout(() => {
            document.getElementById('alu-ops').textContent = `ALU işlemi (${operation}): Sonuç = ${result}`;
          }, 1000);
        
          setTimeout(() => {
            document.getElementById('status').textContent = `Sonuç Cache (${cachePolicy}) ile işlendi: ${result}`;
          }, 2000);
        
          setTimeout(() => {
            document.getElementById('status').textContent = `Veri RAM'e yazıldı: ${result}`;
          }, 3000);
        });
      
      // Sayaç (İşlem Adımını Takip Etmek İçin)
      let counter = 0;
      
      // Basit FIFO için Kuyruk
      let cacheQueue = [];
      
      // RAM Blokları için Örnek Veri
      let ramData = ['10', '20', '30', '40'];
      
      // İşlem Döngüsü
      function processCycle() {
        counter = (counter + 1) % 180; // Döngüyü daha uzun tuttuk
      
        resetGlow();
      
        if (counter < 30) {
          statusText.textContent = "CPU veri gönderiyor...";
          cpu.classList.add('glow');
      
        } else if (counter < 60) {
          statusText.textContent = "ALU'da işlem seçildi: " + operationSelect.value;
          alu.classList.add('glow');
          processALU(operationSelect.value);
      
        } else if (counter < 90) {
          statusText.textContent = "Cache kontrol ediliyor...";
          cache.classList.add('glow');
          accessCache('A'); // Sadece örnek veri (A) için
      
        } else if (counter < 120) {
          statusText.textContent = "RAM'e erişiliyor...";
          ram.classList.add('glow');
          accessRAM(0); // İlk RAM blok
      
        } else if (counter < 150) {
          statusText.textContent = "Yazma işlemi yapılıyor...";
          writeRAM(1, "99"); // RAM'de bir bloğa yeni veri yazılıyor
      
        } else {
          statusText.textContent = "İşlem döngüsü yeniden başlıyor...";
        }
      }
      
      // Glow Efektlerini Sıfırlama
      function resetGlow() {
        cpu.classList.remove('glow');
        alu.classList.remove('glow');
        cache.classList.remove('glow');
        ram.classList.remove('glow');
      }
      
      // ALU İşlemleri
      function processALU(op) {
        let a = 6, b = 2;
        let result = 0;
        let displayOp = op;
      
        if (op === "AND") result = a & b;
        else if (op === "OR") result = a | b;
        else if (op === "NOT") result = ~a;
        else if (op === "ADD") result = a + b;
        else if (op === "SUB") result = a - b;
        else if (op === "MUL") { result = a * b; displayOp = '*'; }
        else if (op === "DIV") { result = a / b; displayOp = '/'; }
      
        aluOps.textContent = `ALU: ${a} ${displayOp} ${b} = ${result}`;
      }
      
      // Cache Yönetimi (FIFO / LRU Seçimine Göre)
      function accessCache(blockName) {
        let policy = policySelect.value; // FIFO veya LRU
      
        // Eğer blok zaten cache'de varsa
        for (let block of cacheBlocks) {
          if (block.textContent === blockName) {
            block.classList.add('highlight');
            if (policy === "LRU") {
              moveToTop(blockName); // LRU: erişilen blok en öne gelir
            }
            return;
          }
        }
      
        // Blok yoksa ekle (FIFO / LRU mantığına göre)
        if (cacheQueue.length >= cacheBlocks.length) {
          let removed = cacheQueue.shift();
          replaceBlock(removed, blockName);
        }
        cacheQueue.push(blockName);
        replaceBlock(null, blockName);
      }
      
      // Cache'de Blok Değişimi
      function replaceBlock(oldName, newName) {
        for (let block of cacheBlocks) {
          if (block.textContent === oldName || block.textContent === "") {
            block.textContent = newName;
            block.classList.add('highlight');
            return;
          }
        }
      }
      
      // LRU'da Erişilen Bloku Öne Çekmek
      function moveToTop(blockName) {
        cacheQueue = cacheQueue.filter(name => name !== blockName);
        cacheQueue.push(blockName);
      }
      
      // RAM Okuma İşlemi
      function accessRAM(index) {
        if (ramBlocks[index]) {
          ramBlocks[index].classList.add('highlight');
          statusText.textContent = `RAM'den veri okunuyor: ${ramData[index]}`;
        }
      }
      
      // RAM Yazma İşlemi
      function writeRAM(index, newData) {
        if (ramBlocks[index]) {
          ramBlocks[index].classList.add('highlight');
          ramData[index] = newData;
          statusText.textContent = `RAM'e yeni veri yazıldı: ${newData}`;
        }
      }
      
      // Hatalı İşlem Animasyonu (ALU'da geçersiz işlem olursa tetiklenir)
      function errorAnimation() {
        alu.classList.add('glow');
        statusText.textContent = "Hatalı İşlem!";
        aluOps.textContent = "ALU: ERROR!";
      }
      
      // Döngüyü Başlat
      setInterval(processCycle, 100);
      
      document.getElementById('start-btn').addEventListener('click', () => {
          const input1 = parseFloat(document.getElementById('input1').value);
          const input2 = parseFloat(document.getElementById('input2').value);
          const operation = document.getElementById('operation').value;
          const cachePolicy = document.getElementById('cache-policy').value;
          const cacheBlocks = document.querySelectorAll('#cache-blocks .block');
          const ramBlocks = document.querySelectorAll('#ram-blocks .block');
          const dataElement = document.getElementById('data');
        
          let result;
        
          // ALU işlemleri
          switch (operation) {
            case 'ADD': result = input1 + input2; break;
            case 'SUB': result = input1 - input2; break;
            case 'MUL': result = input1 * input2; break;
            case 'DIV': result = input1 / input2; break;
            case 'AND': result = input1 & input2; break;
            case 'OR': result = input1 | input2; break;
            case 'NOT': result = ~input1; break;
            default: result = "Hatalı işlem!";
          }
        
          // Veri hareketi başlat
          dataElement.textContent = `${input1}, ${input2}`;
          dataElement.classList.add('active');
        
          document.getElementById('status').textContent = `CPU veriyi işliyor...`;
          document.getElementById('alu-ops').textContent = `ALU işlemi: ${operation}`;
        
          setTimeout(() => {
            dataElement.classList.remove('active');
        
            document.getElementById('status').textContent = `ALU sonucu: ${result}`;
        
            // Önce Cache içinde arama yap (Hit / Miss)
            setTimeout(() => {
              const hit = checkCacheHit(cacheBlocks, result);
        
              if (hit) {
                document.getElementById('status').textContent = `Cache Hit: Veri zaten cache içinde!`;
              } else {
                document.getElementById('status').textContent = `Cache Miss: RAM'den Cache'e veri yükleniyor...`;
        
                // RAM'de ara ve Cache'e çek
                setTimeout(() => {
                  const ramHit = checkRAM(ramBlocks, result);
        
                  if (ramHit) {
                    updateCache(cacheBlocks, result, cachePolicy);
                    document.getElementById('status').textContent = `Veri RAM'den Cache'e çekildi.`;
                  } else {
                    // Eğer RAM'de yoksa RAM'e yaz, sonra Cache'e çek
                    updateRAM(ramBlocks, result);
                    updateCache(cacheBlocks, result, cachePolicy);
                    document.getElementById('status').textContent = `Veri RAM'e yazıldı ve Cache'e çekildi.`;
                  }
        
                }, 1500);
              }
        
            }, 1500);
        
          }, 2000);
        });
        
        // Cache içinde veri var mı? (Hit kontrolü)
        function checkCacheHit(blocks, value) {
          return Array.from(blocks).some(block => block.textContent == value);
        }
        
        // RAM içinde veri var mı?
        function checkRAM(blocks, value) {
          return Array.from(blocks).some(block => block.textContent == value);
        }
        
        // Cache update fonksiyonu
        function updateCache(blocks, value, policy) {
          let emptyBlock = Array.from(blocks).find(block => !block.classList.contains('active'));
        
          if (!emptyBlock) {
            if (policy === 'FIFO') {
              emptyBlock = blocks[0];
            } else if (policy === 'LRU') {
              emptyBlock = blocks[blocks.length - 1];
            }
            emptyBlock.classList.remove('active');
          }
        
          emptyBlock.textContent = value;
          emptyBlock.classList.add('active');
        }
        
        // RAM update fonksiyonu
        function updateRAM(blocks, value) {
          let emptyBlock = Array.from(blocks).find(block => !block.classList.contains('active'));
        
          if (!emptyBlock) {
            emptyBlock = blocks[0];
            emptyBlock.classList.remove('active');
          }
        
          emptyBlock.textContent = value;
          emptyBlock.classList.add('active');
        }
      // Sayfa yüklendiğinde veya Cache boyutu değişince blokları çiz
      document.addEventListener('DOMContentLoaded', () => {
          createCacheBlocks();
        });
        
        document.getElementById('cache-size').addEventListener('change', () => {
          createCacheBlocks();
        });
        
        // Dinamik Cache blok üretici
        function createCacheBlocks() {
          const cacheSize = parseInt(document.getElementById('cache-size').value);
          const cacheBlocksContainer = document.getElementById('cache-blocks');
          
          // Önceki blokları temizle
          cacheBlocksContainer.innerHTML = '';
        
          // Yeni blokları oluştur
          for (let i = 0; i < cacheSize; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            cacheBlocksContainer.appendChild(block);
          }
        }
      
        emptyBlock.textContent = value;
      // Dinamik RAM blok üretici
      function createRAMBlocks() {
          const ramSize = parseInt(document.getElementById('ram-size').value);
          const ramBlocksContainer = document.getElementById('ram-blocks');
          
          // Önce RAM'i temizle
          ramBlocksContainer.innerHTML = '';
        
          // Yeni blokları oluştur
          for (let i = 0; i < ramSize; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            ramBlocksContainer.appendChild(block);
          }
        }
        document.addEventListener('DOMContentLoaded', () => {
          createCacheBlocks();
          createRAMBlocks();
        });
        
        document.getElementById('cache-size').addEventListener('change', () => {
          createCacheBlocks();
        });
        
        document.getElementById('ram-size').addEventListener('change', () => {
          createRAMBlocks();
        });
        function createRAMBlocks() {
        const ramSize = parseInt(document.getElementById('ram-size').value);
        const ramBlocksContainer = document.getElementById('ram-blocks');
        ramBlocksContainer.innerHTML = '';
      
        for (let i = 0; i < ramSize; i++) {
          const block = document.createElement('div');
          block.className = 'block';
          block.textContent = i + 1; // Blok numarası
          ramBlocksContainer.appendChild(block);
        }
      }
      function createRAMBlocks() {
        const ramContainer = document.getElementById('ram-blocks');
        ramContainer.innerHTML = '';
      
        const size = parseInt(document.getElementById('ram-size').value);
        ramData = []; // RAM verilerini sıfırla
      
        for (let i = 0; i < size; i++) {
          const block = document.createElement('div');
          block.classList.add('block');
          block.textContent = (i + 1).toString();
          ramContainer.appendChild(block);
          ramData.push((i * 10).toString()); // Örnek veri
        }
      }
      
      function createCacheBlocks() {
        const cacheContainer = document.getElementById('cache-blocks');
        cacheContainer.innerHTML = '';
      
        const blockNames = ['A', 'B', 'C', 'D'];
        for (let name of blockNames) {
          const block = document.createElement('div');
          block.classList.add('block');
          block.textContent = name;
          cacheContainer.appendChild(block);
        }
      }
      const dataElement = document.getElementById('data');
}