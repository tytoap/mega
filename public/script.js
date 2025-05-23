document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let cart = [];
    
    // Elementos do DOM
    // Removido: const searchInput = document.querySelector('#searchInput');
    const productCards = document.querySelectorAll('.product-card');
    const productSections = document.querySelector('#productSections');
    const categoryMenu = document.querySelector('#categoryMenu');
    const fixedNavWrapper = document.querySelector('#fixedNavWrapper');
    const navSpacer = document.querySelector('#navSpacer');
    // --- INÍCIO DA ALTERAÇÃO: Obter botão Meus Pedidos ---
    const myOrdersButton = document.querySelector('.nav-button:first-child'); // Seleciona o primeiro botão dentro de .nav-buttons
    // --- FIM DA ALTERAÇÃO: Obter botão Meus Pedidos ---
    
    // Elementos do Modal de Sabores
    const flavorModal = document.querySelector('#flavorModal');
    const modalTitle = document.querySelector('#modalTitle');
    const modalSubtitle = document.querySelector('#modalSubtitle');
    const modalImage = document.querySelector('#modalImage');
    const flavorList = document.querySelector('#flavorList');
    const modalClose = document.querySelector('#modalClose');
    const maxFlavorsSpan = document.querySelector('#maxFlavors');
    const addToCartBtn = document.querySelector('#addToCartBtn');
    
    // Elementos do Carrinho
    const cartButton = document.querySelector('#cartButton');
    const cartBadge = document.querySelector('#cartBadge');
    const cartModal = document.querySelector('#cartModal');
    const cartClose = document.querySelector('#cartClose');
    const cartItems = document.querySelector('#cartItems');
    const cartTotal = document.querySelector('#cartTotal');
    const cartNome = document.querySelector('#cartNome');
    const cartTel = document.querySelector('#cartTel');
    const checkoutBtn = document.querySelector('#checkoutBtn');
    const toast = document.querySelector('#toast');
    
    // Elementos do Alerta
    const cartAlert = document.querySelector('#cartAlert');
    const clearCartBtn = document.querySelector('#clearCartBtn');
    const keepCartBtn = document.querySelector('#keepCartBtn');
    
    // Variáveis para a navegação fixa
    let navHeight = fixedNavWrapper.offsetHeight;
    let navTop = fixedNavWrapper.offsetTop;
    let isNavFixed = false;
    
    // Variáveis para o modal de sabores
    let currentProduct = null;
    let selectedFlavors = [];
    let maxFlavors = 0;
    
    // Sabores disponíveis
    let availableFlavors = {
        pizzap: [],
        pizzag: [],
        pizzagg: []
    };
    
    // Ordem das categorias
    const categoryOrder = [
        'pizzapequena',
        'pizzagrande',
        'pizzagigante',
        'triotradicional1',
        'triotilapia',
        'porcaogrande',
        'porcaomedia',
        'porcao',
        'bebidas'
    ];

  

    // Mapeamento de cores para categorias
    const categoryColors = {
        pizzapequena: 'pink',
        pizzagrande: 'blue',
        pizzagigante: 'orange',
        triotradicional1: 'green',
        triotilapia: 'orange',
        porcaogrande: 'green',
        porcaomedia: 'green',
        bebidas: 'red'
        
    };

    // Mapeamento de nomes para categorias
    const categoryNames = {
        pizzapequena: 'Pizzas Pequenas',
        pizzagrande: 'Pizzas Grandes',
        pizzagigante: 'Pizzas Gigantes',
        triotradicional1: 'Trios Tradicionais',
        triotilapia: 'Trios com Tilápia',
        porcaogrande: 'Porções Grandes',
        porcaomedia: 'Porções',
        bebidas: 'Bebidas',
        triotilapiacomfrango:'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/coca2l.jpeg?alt=media&token=46dd3664-53bb-4c77-a56d-107b92b8b6d3'
    };

    const sub = 'pz';
     

    // Mapeamento de imagens padrão para categorias
    const defaultImages = {
        pizzapequena: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        pizzagrande: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        pizzagigante: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        triotradicional1: 'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/triopolentapngpng.png?alt=media&token=c1497536-a83e-4b4d-8b22-9dfb71618fef',
        triotilapia: 'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/20210511triotilapiacomfrangopng.png?alt=media&token=ce9a2dd2-ec21-4a7e-965d-5a5d073d5f67',
        porcaogrande1: 'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/coca2l.jpeg?alt=media&token=46dd3664-53bb-4c77-a56d-107b92b8b6d3',
        porcaomedia: 'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/frangokingporcaoeasyfoodlondrinajpg.jpeg?alt=media&token=80fb5018-b556-4128-8ec8-b1c45e59277a',
        bebidas: 'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/refijpg.jpeg?alt=media&token=930129b5-dfe9-4dba-9a82-9b4197c3dd14',
        sucos:'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/sucos.png?alt=media&token=24dc15ca-461d-4f96-8abe-0d7b0944219d',

        pizzapequenapz: 'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/logo.png?alt=media&token=932bd638-12a4-4233-ba74-6ebabec21ef0',
        refrigerantes:'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/coca2l.jpeg?alt=media&token=46dd3664-53bb-4c77-a56d-107b92b8b6d3',
        cervejas:'https://firebasestorage.googleapis.com/v0/b/megapizza-vilaa.firebasestorage.app/o/cervajpg.jpeg?alt=media&token=a12902e8-5b2e-4e5b-bb62-14a52e1100d8'
    };

    // Carregar dados do Firebase
    fetch('https://megapizza-vilaa-default-rtdb.firebaseio.com/.json')
        .then(response => response.json())
        .then(data => {
            // Ordenar categorias
            const sortedCategories = Object.keys(data).filter(category => category !== 'sabores')
                .sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

            // Criar botões do menu e seções
            sortedCategories.forEach(category => {
                // --- INÍCIO: Processamento da categoria triotradicional ---
                // Aqui é onde os dados do triotradicional são carregados do Firebase
                // A categoria 'triotradicional' está definida em categoryOrder e será processada aqui
                // Os dados virão do objeto data[category] quando category for 'triotradicional'
                // --- FIM: Processamento da categoria triotradicional ---

                const button = document.createElement('button');
                button.className = `category-button category-${categoryColors[category]}`;
                button.setAttribute('data-target', category);
                button.textContent = categoryNames[category];
                
                button.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
                
                categoryMenu.appendChild(button);

                // Criar seção de produtos
                const section = document.createElement('section');
                section.className = 'product-section';
                section.id = category;

                const sectionTitle = document.createElement('h2');
                sectionTitle.className = 'section-title';
                sectionTitle.innerHTML = `<span style="color: #E91E63; margin-right: 8px;">▶</span>${categoryNames[category]}`;

                const productGrid = document.createElement('div');
                productGrid.className = 'product-grid';

                // Adicionar produtos baseado na categoria
                if (category.includes('pizza')) {
                    // Criar cards para pizzas com diferentes números de sabores
                    const maxFlavors = category === 'pizzapequena' ? 2 : category === 'pizzagrande' ? 3 : 4;
                    const basePrice = data[category].price || 0;

                    for (let i = 1; i <= maxFlavors; i++) {
                        const price = basePrice;
                        const card = createProductCard(
                            `${category}-${i}`,
                            category,
                            price,
                            `${categoryNames[category]}`,
                            `${i} Sabor${i > 1 ? 'es' : ''}`,
                            defaultImages[`${category}`] || defaultImages[category],
                            
                            maxFlavors
                        );
                        productGrid.appendChild(card);
                    }
                } else if (data[category].items) {
                    // Criar cards para todas as categorias com items
                    data[category].items.forEach(item => {
                        let price = 0;
                        if (item.sizes) {
                            // Se o item tem tamanhos, usa o preço do primeiro tamanho
                            const firstSize = Object.entries(item.sizes).find(([key]) => key !== 'acompanhamentos_gratis');
                            if (firstSize) {
                                price = firstSize[1].price || 0;
                            }
                           
                            

                            // Criar card normal para todos os itens com tamanhos
                            const card = createProductCard(
                                `${category}-${item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '-')}`,
                                category,
                                category === 'triotilapia' ? null : price, // Não mostra preço para triotilapia
                                item.name,
                                item.description,
                                defaultImages[`${item.name.toLowerCase().replace(/\s+/g, '')}`] || defaultImages[category],
                                //defaultImages[category]

                                 
                                //defaultImages[`${category}${sub}`] || defaultImages[category],
                            );
                            productGrid.appendChild(card);
                        } else {
                            // Se não tem tamanhos, usa o preço direto do item
                            price = item.price || 0;
                            const card = createProductCard(
                                `${category}-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
                                category,
                                price,
                                item.name,
                                item.description,
                                defaultImages[`${item.name.toLowerCase().replace(/\s+/g, '')}`] || defaultImages[category],
                            );
                            productGrid.appendChild(card);
                        }
                    });
                }

                section.appendChild(sectionTitle);
                section.appendChild(productGrid);
                productSections.appendChild(section);
            });

            // Carregar sabores do Firebase
            fetch('https://megapizza-vilaa-default-rtdb.firebaseio.com/sabores/items.json')
            
            
                .then(response => response.json())
                .then(sabores => {
                    availableFlavors = {
                        pizzapequena: sabores,
                        pizzagrande: sabores,
                        pizzagigante: sabores
                    };
                })
                .catch(error => {
                    console.error('Erro ao carregar sabores:', error);
                    showToast('Erro ao carregar sabores. Tente novamente.');
                });

            // Adicionar eventos de clique aos cards após criar todas as seções
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    const isPizza = ['pizzapequena', 'pizzagrande', 'pizzagigante'].includes(category);
            
                    if (isPizza) {
                        openFlavorModal(this);
                    } else {
                        // Abrir modal para todos os outros produtos
                        const itemName = this.querySelector('.product-title').textContent;
                        const item = data[category].items.find(i => i.name === itemName);
            
                        if (item) {
                            if (item.sizes) {
                                // Se o item tem tamanhos, mostra as opções no modal
                                if (category === 'triotilapia') {
                                    openItemsModal(this, Object.entries(item.sizes)
                                        .filter(([key]) => key !== 'acompanhamentos_gratis')
                                        .map(([size, sizeData]) => ({
                                            name: `${item.name} ${size}`,
                                            description: item.description,
                                            price: sizeData.price || sizeData.preco,
                                            acompanhamentos_gratis: item.sizes.acompanhamentos_gratis,
                                            image: defaultImages[`${category}${sub}`] || defaultImages[category] 
                                        })));
                                } else if (category === 'bebidas') {
                                    openItemsModal(this, Object.entries(item.sizes).map(([sizeKey, sizeData]) => {
                                        const displayName = sizeData[sizeKey] || sizeKey;
                                        return {
                                            name: ` ${displayName}`,
                                            description: sizeData.description || '',
                                            price: sizeData.price || sizeData.preco,
                                        };
                                    }));
                                }else if (category === 'porcaomedia') {
                                    const additional = item.sizes.acompanhamentos_adcional || [];
                                
                                    openItemsModal(this, 
                                        Object.entries(item.sizes)
                                            .filter(([key]) => key !== 'acompanhamentos_adcional')
                                            .map(([size, sizeData]) => ({
                                                name: `${size}`,
                                                description: item.description,
                                                price: sizeData.price || sizeData.preco,
                                                acompanhamentos_adcional: additional
                                            }))
                                    );
                                }
                                 else {
                                    openItemsModal(this, Object.entries(item.sizes).map(([size, sizeData]) => ({
                                        name: `${item.name} (${size})`,
                                        description: `${item.description} - ${sizeData.peso}`,
                                        price: sizeData.preco,
                                        molho: sizeData.molho_adicional?.nome,
                                        molhopreco: sizeData.molho_adicional?.preco
                                    })));
                                }
                            } else {
                                // Se o item não tem tamanhos, mostra apenas o item no modal
                                openItemsModal(this, [{
                                    name: item.name,
                                    description: item.description,
                                    price: item.price || 0
                                }]);
                            }
                        } else {
                            showToast('Item não disponível no momento.');
                        }
                    }
                });
            });
            
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            showToast('Erro ao carregar dados. Tente novamente.');
        });

    // Função para criar um card de produto
    function createProductCard(id, category, price, title, subtitle, image, maxFlavors = null) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product', id);
        card.setAttribute('data-category', category);
        card.setAttribute('data-price', price);
        if (maxFlavors) {
            card.setAttribute('data-max-flavors', maxFlavors);
        }

        card.innerHTML = `
            <div class="product-info">
                <h3 class="product-title">${title}</h3>
                <p class="product-subtitle">${subtitle}</p>
                
                ${price ? `<p class="product-price">R$ ${price.toFixed(2).replace('.', ',')}</p>` : ''}
            </div>
            <img src="${image}" alt="${title}" class="product-image">
        `;

        return card;
    }
    
    // Função para abrir o modal de itens
    function openItemsModal(productCard, items) {
        currentProduct = {
            id: productCard.getAttribute('data-product'),
            name: productCard.querySelector('.product-title').textContent,
            subtitle: productCard.querySelector('.product-subtitle').textContent,
            price: parseFloat(productCard.getAttribute('data-price')),
            image: productCard.querySelector('.product-image').src,
            category: productCard.getAttribute('data-category')
        };
        
        modalTitle.textContent = currentProduct.name;
        modalImage.src = currentProduct.image;
        modalImage.alt = currentProduct.name;
        modalSubtitle.textContent = 'Escolha as opções';
        
        // Preencher a lista de itens
        flavorList.innerHTML = '';
        
        let selectedSize = null;
        let selectedSauce = false;
        let selectedAccompaniments = [];
        //let selectedAccompaniment = null;
        let selectedAdditionalAccompaniments = [];
        let totalPrice = 0;
        
        // Criar seção de tamanhos
        if (items.length > 1 || items[0].price) {
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'flavor-item';
                li.setAttribute('data-index', index);
                li.innerHTML = `
                    <span class="flavor-icon">
                        <img src="${currentProduct.image}" alt="Ícone" style="width: 50px; height: 50px; vertical-align: middle; margin-right: 5px;">

                        
                        </span>
                    <div>
                        <div class="flavor-name">${item.name}</div>
                        <div class="flavor-description">${item.description}</div>
                        <div class="flavor-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                        
                    </div>
                `;
                
                li.addEventListener('click', function() {
                    // Remove seleção anterior
                    flavorList.querySelectorAll('.flavor-item').forEach(item => item.classList.remove('selected'));
                    // Adiciona seleção atual
                    this.classList.add('selected');
                    selectedSize = index;
                    totalPrice = item.price;
                    if (selectedSauce && item.molhopreco) {
                        totalPrice += item.molhopreco;
                    }
                    updateTotalPrice();
                });
                
                flavorList.appendChild(li);
            });
        }
        
        // Criar seção de molho adicional (se disponível)
        if (items[0].molho) {
            const sauceItem = document.createElement('li');
            sauceItem.className = 'flavor-item sauce-option';
            sauceItem.innerHTML = `
                <span class="flavor-icon">🧂</span>
                <div>
                    <div class="flavor-name">${items[0].molho}</div>
                    <div class="flavor-description">Adicional</div>
                    <div class="flavor-price">+ R$ ${items[0].molhopreco.toFixed(2).replace('.', ',')}</div>
                </div>
            `;
            
            sauceItem.addEventListener('click', function() {
                this.classList.toggle('selected');
                selectedSauce = this.classList.contains('selected');
                totalPrice = selectedSize !== null ? items[selectedSize].price : 0;
                if (selectedSauce && selectedSize !== null) {
                    totalPrice += items[selectedSize].molhopreco;
                }
                updateTotalPrice();
            });
            
            flavorList.appendChild(sauceItem);
        }
        // Criar seção de molho adicional (se disponível)
        if (items[0].acompanhamentos_adcional) {
            const accompanimentTitle = document.createElement('li');
            accompanimentTitle.className = 'flavor-item-title';
            accompanimentTitle.innerHTML = '<h3>Acompanhamento Adicional:</h3>';
            flavorList.appendChild(accompanimentTitle);
        
            const acompanhamentosAdicionais = items[0].acompanhamentos_adcional;
        
            acompanhamentosAdicionais.forEach((accomp, index) => {
                const accompItem = document.createElement('li');
                accompItem.className = 'flavor-item accompaniment-option';
                accompItem.innerHTML = `
                    <span class="flavor-icon">🥔</span>
                    <div>
                        <div class="flavor-name">${accomp.name}</div>
                        <div class="flavor-description">Acompanhamento adicional</div>
                        <div class="flavor-price">+ R$ ${accomp.price.toFixed(2).replace('.', ',')}</div>
                    </div>
                    
                `;
            
                accompItem.addEventListener('click', function () {
                    this.classList.toggle('selected');
                    const name = accomp.name;
                    const price = accomp.price;
            
                    if (this.classList.contains('selected')) {
                        selectedAdditionalAccompaniments.push({ name, price });
                    } else {
                        selectedAdditionalAccompaniments = selectedAdditionalAccompaniments.filter(a => a.name !== name);
                    }
            
                    updateTotalPrice();
                });
            
                flavorList.appendChild(accompItem);
            });
        }

        // Criar seção de acompanhamentos gratuitos (se disponível)
        if (items[0].acompanhamentos_gratis) {
            const accompanimentTitle = document.createElement('li');
            accompanimentTitle.className = 'flavor-item-title';
            accompanimentTitle.innerHTML = '<h3>Escolha um acompanhamento:</h3>';
            flavorList.appendChild(accompanimentTitle);

            const accompaniments = Array.isArray(items[0].acompanhamentos_gratis) 
                ? items[0].acompanhamentos_gratis 
                : Object.entries(items[0].acompanhamentos_gratis).map(([key, value]) => ({ name: value }));

            accompaniments.forEach((accomp, index) => {
                const accompItem = document.createElement('li');
                accompItem.className = 'flavor-item accompaniment-option';
                accompItem.innerHTML = `
                    <span class="flavor-icon">🥔</span>
                    <div>
                        <div class="flavor-name">${accomp.name}</div>
                        <div class="flavor-description">Acompanhamento grátis</div>
                    </div>
                `;
                
                accompItem.addEventListener('click', function() {
                    // Remove seleção anterior
                                        this.classList.toggle('selected');
                    const name = accomp.name;

                    if (this.classList.contains('selected')) {
                        selectedAccompaniments.push(name);
                    } else {
                        selectedAccompaniments = selectedAccompaniments.filter(a => a !== name);
                    }
                    updateTotalPrice();
                });
                
                flavorList.appendChild(accompItem);
            });
        }
        // Atualizar o botão de adicionar ao carrinho
        addToCartBtn.textContent = 'Selecione um tamanho';
        addToCartBtn.disabled = true;
        addToCartBtn.style.opacity = '0.7';
        
        // Função para atualizar o preço total
        function updateTotalPrice() {
            if (selectedSize !== null) {
                let total = items[selectedSize].price;
        
                if (selectedSauce && items[selectedSize].molhopreco) {
                    total += items[selectedSize].molhopreco;
                }
        
                if (selectedAdditionalAccompaniments.length > 0) {
                    selectedAdditionalAccompaniments.forEach(item => {
                        total += item.price;
                    });
                }
        
                totalPrice = total;
        
                addToCartBtn.textContent = `Adicionar ao carrinho - R$ ${total.toFixed(2).replace('.', ',')}`;
                addToCartBtn.disabled = false;
                addToCartBtn.style.opacity = '1';
            } else {
                addToCartBtn.textContent = 'Selecione um tamanho';
                addToCartBtn.disabled = true;
                addToCartBtn.style.opacity = '0.7';
            }
        }
        
        
        
        // Remover eventos anteriores e adicionar novo evento ao botão
        const handleAddToCart = function () {
            if (selectedSize === null) return;
        
            const selectedItem = items[selectedSize];
        
            const itemName = selectedItem.name || currentProduct.name || 'Produto';
            const itemPrice = totalPrice;
            const itemDescription = selectedItem.description || currentProduct.description || '';
        
            const subtitleExtras = [];
        
            if (selectedSauce) {
                subtitleExtras.push(selectedSauce); // ou selectedItem.molho, se for string
            }
            if (selectedAdditionalAccompaniments.length > 0) {
                selectedAdditionalAccompaniments.forEach(acc => subtitleExtras.push(acc.name));
            }
            if (selectedAccompaniments.length > 0) {
                selectedAccompaniments.forEach(acc => subtitleExtras.push(acc));
            }
        
            const itemSubtitle = itemDescription + (subtitleExtras.length ? ' + ' + subtitleExtras.join(' + ') : '');
        
            addToCart({
                id: `${currentProduct.id}-${selectedSize}-${Date.now()}`,
                name: itemName,
                subtitle: itemSubtitle,
                price: itemPrice,
                image: currentProduct.image,
                category: currentProduct.category
            });
        
            flavorModal.classList.remove('active');
        };
        

        // Remover evento anterior se existir
        addToCartBtn.removeEventListener('click', handleAddToCart);
        // Adicionar novo evento
        addToCartBtn.addEventListener('click', handleAddToCart);
        
        flavorModal.classList.add('active');
    }
    
    // Navegação fixa ao rolar
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > navTop && !isNavFixed) {
            // Fixar a navegação
            fixedNavWrapper.classList.add('fixed');
            navSpacer.classList.add('active');
            navSpacer.style.height = navHeight + 'px';
            isNavFixed = true;
        } else if (scrollY <= navTop && isNavFixed) {
            // Desfixar a navegação
            fixedNavWrapper.classList.remove('fixed');
            navSpacer.classList.remove('active');
            navSpacer.style.height = '0';
            isNavFixed = false;
        }
        
        // Highlight no menu conforme scroll
        const sections = document.querySelectorAll('.product-section');
        const scrollPos = window.scrollY + 120;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        categoryMenu.querySelectorAll('.category-button').forEach(button => {
            if (button.getAttribute('data-target') === current) {
                button.classList.add('active');
                // Em telas pequenas, rola o menu para mostrar o botão ativo
                if (window.innerWidth <= 768) {
                    button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            } else {
                button.classList.remove('active');
            }
        });
    });
    
    // Recalcular dimensões da navegação ao redimensionar a janela
    window.addEventListener('resize', function() {
        navHeight = fixedNavWrapper.offsetHeight;
        navTop = isNavFixed ? navSpacer.offsetTop : fixedNavWrapper.offsetTop;
        
        if (isNavFixed) {
            navSpacer.style.height = navHeight + 'px';
        }
    });
    
    // Inicializar as dimensões da navegação
    window.addEventListener('load', function() {
        navHeight = fixedNavWrapper.offsetHeight;
        navTop = fixedNavWrapper.offsetTop;
    });
    
    // Função para abrir o modal de sabores
    function openFlavorModal(productCard) {
        currentProduct = {
            id: productCard.getAttribute('data-product'),
            name: productCard.querySelector('.product-title').textContent,
            subtitle: productCard.querySelector('.product-subtitle').textContent,
            price: parseFloat(productCard.getAttribute('data-price')),
            image: productCard.querySelector('.product-image').src,
            category: productCard.getAttribute('data-category')
        };
        
        maxFlavors = parseInt(productCard.getAttribute('data-max-flavors')) || 1;
        selectedFlavors = [];
        
        modalTitle.textContent = `${currentProduct.name} - ${currentProduct.subtitle}`;
        modalImage.src = currentProduct.image;
        modalImage.alt = currentProduct.name;
        maxFlavorsSpan.textContent = maxFlavors;
        
        // Preencher a lista de sabores
        flavorList.innerHTML = '';
        const flavors = availableFlavors[currentProduct.category] || [];
        
        flavors.forEach((flavor, index) => {
            const li = document.createElement('li');
            li.className = 'flavor-item';
            li.setAttribute('data-index', index);
            li.innerHTML = `
                <span class="flavor-icon">🍕</span>
                <div>
                    <div class="flavor-name">${flavor.name}</div>
                    <div class="flavor-description">${flavor.description}</div>
                </div>
            `;
            
            li.addEventListener('click', function() {
                const flavorIndex = parseInt(this.getAttribute('data-index'));
                const flavorIdx = selectedFlavors.findIndex(f => f.index === flavorIndex);
                
                if (flavorIdx > -1) {
                    // Remover sabor
                    selectedFlavors.splice(flavorIdx, 1);
                    this.classList.remove('selected');
                } else {
                    // Adicionar sabor se não exceder o limite
                    if (selectedFlavors.length < maxFlavors) {
                        selectedFlavors.push({
                            index: flavorIndex,
                            name: flavor.name
                        });
                        this.classList.add('selected');
                    } else {
                        showToast(`Máximo de ${maxFlavors} sabores!`);
                    }
                }
                
                updateAddToCartButton();
            });
            
            flavorList.appendChild(li);
        });
        
        updateAddToCartButton();
        flavorModal.classList.add('active');
    }
    
    // Atualizar o botão de adicionar ao carrinho
    function updateAddToCartButton() {
        if (selectedFlavors.length > 0) {
            addToCartBtn.textContent = `Adicionar ${selectedFlavors.length} sabor(es) ao carrinho`;
            addToCartBtn.disabled = false;
            addToCartBtn.style.opacity = '1';
        } else {
            addToCartBtn.textContent = 'Selecione pelo menos 1 sabor';
            addToCartBtn.disabled = true;
            addToCartBtn.style.opacity = '0.7';
        }
    }
    
    // Fechar o modal de sabores
    modalClose.addEventListener('click', function() {
        flavorModal.classList.remove('active');
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && flavorModal.classList.contains('active')) {
            flavorModal.classList.remove('active');
        }
    });
    
    // Botão voltar para mobile
    const modalBack = document.getElementById('modalBack');
    modalBack.addEventListener('click', function() {
        flavorModal.classList.remove('active');
    });
    
    // Adicionar ao carrinho a partir do modal
    addToCartBtn.addEventListener('click', function() {
        if (selectedFlavors.length === 0) return;
        
        const sabores = selectedFlavors.map(f => f.name).join(' + ');
        const adicionais = selectedAdditionalAccompaniments.map(a => a.name).join(' + ') || 'semAdicionais';
        const molho = selectedSauce || 'semMolho';
        const tamanho = selectedSize || 'semTamanho';
    
        const item = {
            id: currentProduct.id,
            name: `${currentProduct.name} (${sabores})`,
            subtitle: currentProduct.subtitle,
            price: totalPrice,
            image: currentProduct.image,
            category: currentProduct.category,
            idCombinado: `${currentProduct.id}-${sabores}-${tamanho}-${molho}-${adicionais}`
        };
    
        addToCart(item);
        flavorModal.classList.remove('active');
    });
    
    // Carregar carrinho do localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('megapizza_cart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart) || [];
            } catch (e) {
                cart = [];
            }
        }
        updateCartBadge();
    }
    
    // Salvar carrinho no localStorage
    function saveCart() {
        localStorage.setItem('megapizza_cart', JSON.stringify(cart));
    }
    
    // Adicionar ao carrinho
    // Adicionar ao carrinho
function addToCart(item) {
    const existingItemIndex = cart.findIndex(i => i.idCombinado === item.idCombinado);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    saveCart();
    updateCartBadge();
    showToast('Adicionado ao carrinho!');
}
    
    // Atualizar badge do carrinho
    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }
    
    // Abrir modal do carrinho pelo botão flutuante (com campos de checkout visíveis)
    cartButton.addEventListener('click', function() {
        renderCart();
        cartAlert.style.display = 'none'; // Esconde o alerta ao abrir manualmente (ou defina como 'flex' se quiser que apareça)
        cartModal.classList.add('active');
        // --- INÍCIO DA ALTERAÇÃO: Garantir campos de checkout visíveis ---
        // Quando aberto pelo botão do carrinho flutuante, mostramos os campos de checkout
        document.querySelector('.cart-fields').style.display = 'flex';
        document.querySelector('.cart-checkout').style.display = 'block';
        // --- FIM DA ALTERAÇÃO: Garantir campos de checkout visíveis ---
    });
    
    // --- INÍCIO DA ALTERAÇÃO: Abrir modal do carrinho pelo botão Meus Pedidos (apenas visualização) ---
    if (myOrdersButton) { // Verifica se o botão existe
        myOrdersButton.addEventListener('click', function() {
            renderCart();
            // --- INÍCIO DA ALTERAÇÃO: Ocultar o alerta ao abrir pelo botão Meus Pedidos ---
            cartAlert.style.display = 'none'; // Oculta o alerta
            // --- FIM DA ALTERAÇÃO: Ocultar o alerta ao abrir pelo botão Meus Pedidos ---
            cartModal.classList.add('active');
            // --- INÍCIO DA ALTERAÇÃO: Ocultar campos de checkout ---
            // Quando aberto pelo botão Meus Pedidos, ocultamos os campos de checkout e o botão de finalizar
            document.querySelector('.cart-fields').style.display = 'none';
            document.querySelector('.cart-checkout').style.display = 'none';
            // --- FIM DA ALTERAÇÃO: Ocultar campos de checkout ---
        });
    }
    // --- FIM DA ALTERAÇÃO: Abrir modal do carrinho pelo botão Meus Pedidos (apenas visualização) ---
    
    // Fechar modal do carrinho
    cartClose.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });
    
    // Renderizar carrinho
    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-quantity">Qtd: ${item.quantity}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
                        <button class="cart-item-remove" data-index="${index}">Remover</button>
                    </div>
                `;
                
                cartItems.appendChild(div);
            });
        }
        
        cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    
    // Remover item do carrinho
    cartItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart-item-remove')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            cart.splice(index, 1);
            saveCart();
            renderCart();
            updateCartBadge();
        }
    });
    
    // Limpar carrinho
    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
        updateCartBadge();
        cartAlert.style.display = 'none';
        showToast('Carrinho limpo!');
    }
    
    // Botões do alerta
    clearCartBtn.addEventListener('click', function() {
        clearCart();
    });
    
    keepCartBtn.addEventListener('click', function() {
        cartAlert.style.display = 'none';
    });
    
    // Finalizar pedido
    checkoutBtn.addEventListener('click', function() {
        const nome = cartNome.value.trim();
        const tel = cartTel.value.trim();
        const observacoes = document.getElementById('cartObservations').value.trim(); // pegar valor do textarea
        
        if (!nome || !tel) {
            showToast('Preencha nome e telefone!');
            return;
        }
        
        if (cart.length === 0) {
            showToast('Seu carrinho está vazio!');
            return;
        }
        
        let msg = `Olá! Aqui é ${nome}. Quero fazer um pedido:%0A%0A`;
        
        cart.forEach(item => {
            msg += `- ${item.name} -- Qtd: ${item.quantity}%0A`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        msg += `%0ATotal: R$ ${total.toFixed(2)}%0A%0A`;
        msg += `Nome: ${nome}%0ATelefone: ${tel}`;
        if(observacoes) {
            msg += `Observações: ${observacoes}%0A%0A`;
        }
        
        
        const numero = '5545991498041'; // Número de exemplo
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
        const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
        const url = `${baseUrl}?phone=${numero}&text=${msg}`;
        
        // Fechar o modal antes de abrir o WhatsApp
        cartModal.classList.remove('active');
        
        window.open(url, '_blank');
    });
    
    // Exibir toast
    function showToast(message) {
        toast.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }
    
    // Verificar carrinho ao iniciar
    function checkCartOnLoad() {
        loadCart();
        
        if (cart.length > 0) {
            renderCart();
            cartModal.classList.add('active');
            cartAlert.style.display = 'flex';
        }
    }
    
    // Inicializar
    checkCartOnLoad();
});
