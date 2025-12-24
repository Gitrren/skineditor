// Estado do editor
const state = {
    sprite: '',
    background: '',
    name: '',
    tooltip: '',
    youtube: '',
    source: '',
    width: '',
    height: '',
    tile: '',
    tile_x: -25,
    tile_y: -15,
    offset_x: 0
};

// Elementos do DOM
const inputs = {
    sprite: document.getElementById('sprite'),
    background: document.getElementById('background'),
    name: document.getElementById('name'),
    tooltip: document.getElementById('tooltip'),
    youtube: document.getElementById('youtube'),
    source: document.getElementById('source'),
    width: document.getElementById('width'),
    height: document.getElementById('height'),
    tile: document.getElementById('tile'),
    tile_x: document.getElementById('tile_x'),
    tile_y: document.getElementById('tile_y'),
    offset_x: document.getElementById('offset_x')
};

const previewPodium = document.getElementById('preview-podium');
const exportCodeTextarea = document.getElementById('export-code');
const importCodeTextarea = document.getElementById('import-code');
const tooltip = document.getElementById('tooltip');
let hoveredSlot = null;

// Função para construir URL de arquivo (simulado - em produção seria da wiki)
function getFileURL(filename) {
    if (!filename) return '';
    // Em produção, isso seria substituído pela URL real da wiki
    // Por enquanto, assume que as imagens estão na mesma pasta ou relativa
    return filename;
}

// Função para atualizar o preview
function updatePreview() {
    previewPodium.innerHTML = '';
    
    if (!state.sprite) {
        previewPodium.innerHTML = '<p style="color: #aaa; text-align: center; padding: 40px;">Preencha os campos para ver o preview</p>';
        return;
    }
    
    const slot = document.createElement('div');
    slot.className = 'podium-slot';
    slot.setAttribute('data-skin-index', '1');
    
    const tooltipHtml = state.name 
        ? `<b>${state.name}</b>${state.tooltip ? '<br>' + state.tooltip : ''}`
        : (state.tooltip || '');
    
    if (tooltipHtml) {
        slot.setAttribute('data-skin-tooltip', tooltipHtml);
    }
    
    if (state.youtube) {
        slot.setAttribute('data-youtube', state.youtube);
        slot.classList.add('is-clickable');
    }
    
    const spriteContainer = document.createElement('div');
    spriteContainer.className = 'podium-sprite-container';
    
    const spriteDiv = document.createElement('div');
    spriteDiv.className = 'podium-sprite';
    
    const spriteImg = document.createElement('img');
    spriteImg.src = getFileURL(state.sprite);
    spriteImg.alt = state.name || 'Sprite';
    spriteImg.onerror = () => {
        spriteImg.style.display = 'none';
    };
    
    const platform = document.createElement('div');
    platform.className = 'podium-platform';
    
    if (state.tile) {
        const platformTop = document.createElement('div');
        platformTop.className = 'podium-platform-top';
        
        const tileImg = document.createElement('img');
        tileImg.src = getFileURL(state.tile);
        tileImg.alt = 'Tile';
        tileImg.onerror = () => {
            tileImg.style.display = 'none';
        };
        
        platformTop.appendChild(tileImg);
        platform.appendChild(platformTop);
        
        // Aplica posições do tile
        if (state.tile_x !== null && state.tile_x !== undefined) {
            platform.style.right = state.tile_x + 'px';
        }
        if (state.tile_y !== null && state.tile_y !== undefined) {
            platform.style.bottom = state.tile_y + 'px';
        }
    }
    
    spriteDiv.appendChild(spriteImg);
    spriteDiv.appendChild(platform);
    spriteContainer.appendChild(spriteDiv);
    slot.appendChild(spriteContainer);
    previewPodium.appendChild(slot);
    
    // Aplica deslocamento horizontal
    if (state.offset_x !== 0) {
        slot.style.transform = `translateX(${state.offset_x}px)`;
    }
    
    // Inicializa interatividade
    initPreviewInteractivity();
}

// Função para inicializar interatividade do preview
function initPreviewInteractivity() {
    const podium = previewPodium;
    const slots = podium.querySelectorAll('.podium-slot');
    
    slots.forEach(slot => {
        const spriteImg = slot.querySelector('.podium-sprite img');
        
        if (spriteImg) {
            spriteImg.addEventListener('pointerenter', (ev) => {
                if (!slot.hasAttribute('data-skin-tooltip')) return;
                if (!isPixelTransparent(spriteImg, ev.clientX, ev.clientY)) {
                    setHovered(slot);
                }
            }, { passive: true });
            
            spriteImg.addEventListener('pointermove', (ev) => {
                if (!slot.hasAttribute('data-skin-tooltip')) return;
                if (isPixelTransparent(spriteImg, ev.clientX, ev.clientY)) {
                    if (hoveredSlot === slot) setHovered(null);
                } else {
                    if (hoveredSlot !== slot) setHovered(slot);
                }
            }, { passive: true });
            
            spriteImg.addEventListener('pointerleave', (ev) => {
                const toCard = ev.relatedTarget?.closest?.('.podium-slot');
                if (toCard && podium.contains(toCard)) {
                    const otherImg = toCard.querySelector('.podium-sprite img');
                    if (otherImg && ev.relatedTarget && !isPixelTransparent(otherImg, ev.clientX, ev.clientY)) {
                        return;
                    }
                }
                setHovered(null);
            }, { passive: true });
        }
    });
    
    podium.addEventListener('pointerleave', () => setHovered(null), { passive: true });
}

// Função para verificar transparência de pixel
function isPixelTransparent(img, x, y) {
    if (!img.complete || img.naturalWidth === 0) return true;
    
    try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const rect = img.getBoundingClientRect();
        const scaleX = img.naturalWidth / rect.width;
        const scaleY = img.naturalHeight / rect.height;
        const imgX = Math.floor((x - rect.left) * scaleX);
        const imgY = Math.floor((y - rect.top) * scaleY);
        
        if (imgX < 0 || imgX >= img.naturalWidth || imgY < 0 || imgY >= img.naturalHeight) {
            return true;
        }
        
        const pixelData = ctx.getImageData(imgX, imgY, 1, 1).data;
        return pixelData[3] < 10;
    } catch (e) {
        return false;
    }
}

// Função para gerenciar hover
function setHovered(card) {
    if (hoveredSlot === card) return;
    
    const podium = previewPodium;
    
    if (hoveredSlot) {
        hoveredSlot.classList.remove('hovered');
    }
    
    podium.classList.remove('hovering');
    podium.querySelectorAll('.podium-slot.dim').forEach(n => n.classList.remove('dim'));
    
    if (!card) {
        hoveredSlot = null;
        hideTooltip();
        return;
    }
    
    hoveredSlot = card;
    hoveredSlot.classList.add('hovered');
    podium.classList.add('hovering');
    podium.querySelectorAll('.podium-slot').forEach(n => {
        if (n !== hoveredSlot) n.classList.add('dim');
    });
    
    card.style.zIndex = '9999';
    const spriteContainer = card.querySelector('.podium-sprite-container');
    if (spriteContainer) spriteContainer.style.zIndex = '9999';
    
    showTooltip(card);
}

// Função para mostrar tooltip
function showTooltip(card) {
    const tooltipText = card.getAttribute('data-skin-tooltip') || '';
    if (!tooltipText) return;
    
    tooltip.innerHTML = tooltipText;
    tooltip.setAttribute('aria-hidden', 'false');
    placeTooltip(card);
    tooltip.style.opacity = '1';
}

// Função para esconder tooltip
function hideTooltip() {
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translate(-9999px,-9999px)';
}

// Função para posicionar tooltip
function placeTooltip(card) {
    if (!card || tooltip.getAttribute('aria-hidden') === 'true') return;
    
    tooltip.style.transform = 'translate(-9999px,-9999px)';
    const tr = tooltip.getBoundingClientRect();
    
    const platformImg = card.querySelector('.podium-platform-top img');
    let platformRect = card.getBoundingClientRect();
    if (platformImg) {
        platformRect = platformImg.getBoundingClientRect();
    } else {
        const platform = card.querySelector('.podium-platform');
        if (platform) {
            platformRect = platform.getBoundingClientRect();
        }
    }
    
    let leftPos = Math.round(platformRect.left + (platformRect.width - tr.width) / 2);
    leftPos = Math.max(8, Math.min(leftPos, window.innerWidth - tr.width - 8));
    
    let top = Math.round(platformRect.bottom + 15);
    if (top + tr.height > window.innerHeight - 8) {
        top = Math.round(platformRect.top - tr.height - 15);
        if (top < 8) top = 8;
    }
    
    tooltip.style.transform = `translate(${leftPos}px, ${top}px)`;
}

// Função para exportar código
function generateExportCode() {
    const params = [];
    
    if (state.sprite) params.push(`sprite=${state.sprite}`);
    if (state.background) params.push(`background=${state.background}`);
    if (state.name) params.push(`name=${state.name}`);
    if (state.tooltip) params.push(`tooltip=${state.tooltip}`);
    if (state.youtube) params.push(`youtube=${state.youtube}`);
    if (state.source) params.push(`source=${state.source}`);
    if (state.width) params.push(`w=${state.width}`);
    if (state.height) params.push(`h=${state.height}`);
    if (state.tile) params.push(`tile=${state.tile}`);
    if (state.tile_x !== -25) params.push(`tile_x=${state.tile_x}`);
    if (state.tile_y !== -15) params.push(`tile_y=${state.tile_y}`);
    if (state.offset_x !== 0) params.push(`offset_x=${state.offset_x}`);
    
    const code = `{{Skin|${params.join('|')}}}`;
    exportCodeTextarea.value = code;
}

// Função para importar código
function importCode() {
    const code = importCodeTextarea.value.trim();
    if (!code) return;
    
    // Remove {{Skin| e }}
    const match = code.match(/\{\{Skin\|(.*?)\}\}/);
    if (!match) {
        alert('Formato inválido. Use: {{Skin|param1=valor1|param2=valor2}}');
        return;
    }
    
    const paramsStr = match[1];
    const params = {};
    
    // Parse dos parâmetros
    paramsStr.split('|').forEach(param => {
        const eqIndex = param.indexOf('=');
        if (eqIndex > 0) {
            const key = param.substring(0, eqIndex).trim();
            const value = param.substring(eqIndex + 1).trim();
            params[key] = value;
        }
    });
    
    // Atualiza estado
    state.sprite = params.sprite || '';
    state.background = params.background || '';
    state.name = params.name || params.nome || '';
    state.tooltip = params.tooltip || '';
    state.youtube = params.youtube || '';
    state.source = params.source || '';
    state.width = params.w || params.width || '';
    state.height = params.h || params.height || '';
    state.tile = params.tile || '';
    state.tile_x = parseInt(params.tile_x) || -25;
    state.tile_y = parseInt(params.tile_y) || -15;
    state.offset_x = parseInt(params.offset_x) || 0;
    
    // Atualiza inputs
    updateInputsFromState();
    updatePreview();
}

// Função para atualizar inputs a partir do estado
function updateInputsFromState() {
    inputs.sprite.value = state.sprite;
    inputs.background.value = state.background;
    inputs.name.value = state.name;
    inputs.tooltip.value = state.tooltip;
    inputs.youtube.value = state.youtube;
    inputs.source.value = state.source;
    inputs.width.value = state.width;
    inputs.height.value = state.height;
    inputs.tile.value = state.tile;
    inputs.tile_x.value = state.tile_x;
    inputs.tile_y.value = state.tile_y;
    inputs.offset_x.value = state.offset_x;
}

// Event listeners para inputs
Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    if (!input) return;
    
    input.addEventListener('input', () => {
        if (key === 'tile_x' || key === 'tile_y' || key === 'offset_x') {
            state[key] = parseInt(input.value) || 0;
        } else {
            state[key] = input.value;
        }
        updatePreview();
    });
});

// Event listeners para botões
document.getElementById('btn-export').addEventListener('click', generateExportCode);
document.getElementById('btn-import').addEventListener('click', importCode);
document.getElementById('btn-copy').addEventListener('click', () => {
    exportCodeTextarea.select();
    document.execCommand('copy');
    alert('Código copiado!');
});

// Atualiza preview quando a página carrega
window.addEventListener('load', () => {
    updatePreview();
});

// Atualiza tooltip em scroll/resize
window.addEventListener('scroll', () => {
    if (hoveredSlot) placeTooltip(hoveredSlot);
}, true);

window.addEventListener('resize', () => {
    if (hoveredSlot) placeTooltip(hoveredSlot);
});

