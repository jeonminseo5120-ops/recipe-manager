/* ==========================================================================
   Refrigerator Recipe Manager - Core Application Logic
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Synonym Definitions for Ingredient Matching
// --------------------------------------------------------------------------
const INGREDIENT_SYNONYMS = {
  '계란': '달걀',
  '달걀': '달걀',
  '파': '대파',
  '대파': '대파',
  '삼겹살': '돼지고기',
  '목살': '돼지고기',
  '돼지고기': '돼지고기',
  '햄': '스팸/햄',
  '스팸': '스팸/햄',
  '스팸/햄': '스팸/햄',
  '닭': '닭고기',
  '닭고기': '닭고기',
  '소': '소고기',
  '소고기': '소고기',
  '떡': '떡볶이떡',
  '떡볶이떡': '떡볶이떡',
  '식용유': '식용유',
  '기름': '식용유',
  '식빵': '식빵',
  '빵': '식빵',
  '라면사리': '라면',
  '라면': '라면',
  '참치': '참치캔',
  '참치캔': '참치캔'
};

function normalizeIngredient(name) {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase().replace(/\s+/g, '');
  return INGREDIENT_SYNONYMS[trimmed] || trimmed;
}

// --------------------------------------------------------------------------
// 2. Predefined Recipe Database
// --------------------------------------------------------------------------
const RECIPE_DATABASE = [
  {
    id: 'rec_1',
    name: '김치볶음밥',
    description: '파기름에 고슬고슬하게 볶아 만든 자취생 최애 한 그릇 요리',
    time: '15분',
    difficulty: '쉬움',
    required: ['밥', '김치', '달걀', '대파', '식용유'],
    steps: [
      '대파를 송송 썰어 식용유를 두른 팬에 볶아 파기름을 냅니다.',
      '잘게 썬 김치를 넣고 파기름과 함께 볶아줍니다.',
      '밥을 넣고 양념이 골고루 배도록 밥알을 가르며 잘 볶아줍니다.',
      '다른 팬에 노릇하고 촉촉한 달걀 프라이를 만듭니다.',
      '그릇에 볶음밥을 담고 그 위에 달걀 프라이를 얹어 완성합니다.'
    ]
  },
  {
    id: 'rec_2',
    name: '계란말이',
    description: '대파를 듬뿍 다져 넣어 향긋하고 부드러운 달걀 반찬',
    time: '10분',
    difficulty: '보통',
    required: ['달걀', '대파', '소금'],
    steps: [
      '달걀을 그릇에 잘 풀고 소금 한 꼬집을 넣어 밑간을 합니다.',
      '대파를 아주 잘게 다져 달걀물에 넣고 골고루 섞어줍니다.',
      '팬에 식용유를 살짝 두르고 키친타올로 닦아낸 뒤 약불에서 달걀물을 얇게 붓습니다.',
      '달걀이 반쯤 익어가면 끝부분부터 조심스럽게 돌돌 말아줍니다.',
      '한쪽으로 밀고 달걀물을 추가로 부어 연결하며 말아준 뒤, 한 김 식혀 썰어냅니다.'
    ]
  },
  {
    id: 'rec_3',
    name: '두부조림',
    description: '칼칼하고 달콤한 간장 양념에 짭조름하게 조린 밥도둑 두부 요리',
    time: '20분',
    difficulty: '보통',
    required: ['두부', '간장', '고춧가루', '대파', '마늘', '설탕'],
    steps: [
      '두부를 도톰하게 썰어 키친타올로 물기를 뺀 뒤 소금을 살짝 뿌려둡니다.',
      '간장, 고춧가루, 설탕, 다진 마늘, 물을 섞어 칼칼한 조림 양념장을 만듭니다.',
      '팬에 식용유를 두르고 두부를 앞뒤로 노릇노릇하게 구워줍니다.',
      '구운 두부 위에 양념장과 썬 대파를 올리고 약불에서 자작하게 조려줍니다.',
      '양념이 촉촉하게 스며들면 불을 끄고 서빙합니다.'
    ]
  },
  {
    id: 'rec_4',
    name: '된장찌개',
    description: '구수하고 진한 국물 맛이 일품인 한국인 대표 찌개 요리',
    time: '20분',
    difficulty: '보통',
    required: ['두부', '양파', '대파', '마늘', '된장'],
    steps: [
      '냄비에 물을 붓고 된장을 체에 걸러 구수하게 풀어준 뒤 끓입니다.',
      '국물이 끓어오르면 깍둑썰기한 양파와 다진 마늘을 먼저 넣고 익힙니다.',
      '재료들이 우러나면 두부를 큼직하게 썰어 넣어 한소끔 끓여줍니다.',
      '마지막으로 송송 썬 대파를 넣고 한소끔만 더 끓여 완성합니다.'
    ]
  },
  {
    id: 'rec_5',
    name: '부대찌개',
    description: '스팸과 김치를 듬뿍 넣고 라면사리로 풍성함을 더한 찌개',
    time: '25분',
    difficulty: '보통',
    required: ['스팸/햄', '두부', '김치', '대파', '라면', '고추장'],
    steps: [
      '스팸/햄, 두부, 김치를 납작하게 썰어 전골 냄비에 보기 좋게 둘러 담습니다.',
      '고추장, 고춧가루, 다진 마늘, 간장을 섞어 전골 양념장을 얹어줍니다.',
      '물이나 육수를 자작하게 부어 강불에서 보글보글 끓여줍니다.',
      '국물이 끓어오르면 라면 사리를 중앙에 올리고 잘 풀어주며 익힙니다.',
      '송송 썬 대파를 넣고 라면이 알맞게 익으면 전골째 상에 냅니다.'
    ]
  },
  {
    id: 'rec_6',
    name: '국물 떡볶이',
    description: '학교 앞 분식집 스타일의 달콤 매콤하고 촉촉한 국물 떡볶이',
    time: '15분',
    difficulty: '쉬움',
    required: ['떡볶이떡', '대파', '고추장', '설탕', '간장'],
    steps: [
      '떡볶이떡은 찬물에 씻어 약 10분간 불려 준비합니다.',
      '냄비에 물을 붓고 고추장, 설탕, 간장을 넣어 달콤 매콤하게 끓입니다.',
      '육수가 끓으면 떡볶이떡을 넣고 중불에서 떡에 양념이 밸 때까지 저어가며 조립니다.',
      '대파를 큼직하게 썰어 넣고 국물이 자작하고 걸쭉해질 때까지 조금 더 끓여 냅니다.'
    ]
  },
  {
    id: 'rec_7',
    name: '제육볶음',
    description: '매콤달콤한 고추장 양념에 센 불로 불맛 나게 볶아낸 고기 요리',
    time: '25분',
    difficulty: '보통',
    required: ['돼지고기', '양파', '대파', '고추장', '간장', '마늘', '설탕'],
    steps: [
      '돼지고기를 한입 크기로 썰어 고추장, 간장, 다진 마늘, 설탕과 함께 조물조물 재워둡니다.',
      '양파는 도톰하게 채 썰고 대파는 큼직하게 어긋 썰어둡니다.',
      '달군 팬에 양념해 둔 돼지고기를 넣고 센 불에서 타지 않게 저어가며 볶아줍니다.',
      '고기가 거의 다 익어가면 채 썬 양파와 대파를 넣고 채소의 아삭함이 남도록 가볍게 더 볶아 냅니다.'
    ]
  },
  {
    id: 'rec_8',
    name: '참치마요덮밥',
    description: '고소한 참치와 스크램블 에그에 단짠 소스를 곁들인 초간단 덮밥',
    time: '10분',
    difficulty: '쉬움',
    required: ['참치캔', '밥', '달걀', '간장', '설탕'],
    steps: [
      '참치캔의 참치 기름을 체에 받쳐 꼭 눌러 빼 줍니다.',
      '그릇에 달걀을 풀고 팬에 식용유를 둘러 부드러운 스크램블 에그를 만듭니다.',
      '간장, 설탕, 물 약간을 팬에 넣고 가볍게 졸여 단짠 데리야끼 소스를 만듭니다.',
      '대접에 따뜻한 밥을 담고 단짠 소스를 골고루 뿌린 후, 스크램블 에그를 둥글게 얹어줍니다.',
      '중앙에 기름을 뺀 참치를 소복하게 올리고 마요네즈를 지그재그로 예쁘게 뿌려줍니다.'
    ]
  },
  {
    id: 'rec_9',
    name: '토마토 파스타',
    description: '올리브유에 볶은 마늘과 양파 풍미 가득한 기본 토마토 파스타',
    time: '15분',
    difficulty: '쉬움',
    required: ['파스타면', '토마토소스', '양파', '마늘', '올리브유'],
    steps: [
      '냄비에 물과 소금을 듬뿍 넣고 물이 끓으면 파스타면을 삶아 건져둡니다.',
      '마늘은 편으로 썰고, 양파는 곱게 다져줍니다.',
      '팬에 올리브유를 두르고 마늘을 볶다 향이 올라오면 다진 양파를 넣고 볶습니다.',
      '양파가 투명해지면 토마토소스를 넣고 중불에서 한소끔 끓입니다.',
      '삶아둔 면을 넣고 소스가 골고루 묻도록 잘 버무리듯 볶아 완성합니다.'
    ]
  },
  {
    id: 'rec_10',
    name: '알리오 올리오',
    description: '마늘과 올리브오일만으로 본연의 담백한 감칠맛을 내는 파스타',
    time: '15분',
    difficulty: '쉬움',
    required: ['파스타면', '마늘', '올리브유', '소금'],
    steps: [
      '끓는 물에 소금을 충분히 넣어 짭조름하게 한 뒤 파스타면을 단단한 정도로 삶습니다.',
      '팬에 올리브유를 넉넉하게 두르고 편으로 썬 마늘을 약불에서 노릇노릇해질 때까지 천천히 구워 향을 냅니다.',
      '마늘향이 오일에 녹아나면 삶아진 파스타면과 면수(면 삶은 물) 한 국자를 붓습니다.',
      '센 불로 오일과 면수가 잘 섞여 뽀얀 소스가 되도록 팬을 세차게 흔들어 준 뒤 소금으로 간을 해 냅니다.'
    ]
  },
  {
    id: 'rec_11',
    name: '프렌치 토스트',
    description: '달걀과 우유를 머금어 입안에서 살살 녹는 촉촉한 식빵 토스트',
    time: '10분',
    difficulty: '쉬움',
    required: ['식빵', '달걀', '우유', '설탕'],
    steps: [
      '넓고 얕은 그릇에 달걀을 풀고 우유와 설탕 1스푼을 섞어 달콤한 달걀물을 만듭니다.',
      '식빵을 앞뒤로 달걀물에 올려 촉촉해지도록 속까지 푹 적셔줍니다.',
      '팬에 식용유(또는 버터)를 두르고 달걀물에 적신 식빵을 올립니다.',
      '약불에서 빵이 타지 않고 달걀이 속까지 익도록 앞뒤로 노릇하게 구워줍니다.',
      '접시에 담아 설탕을 솔솔 뿌려 완성합니다.'
    ]
  },
  {
    id: 'rec_12',
    name: '스팸 계란 볶음밥',
    description: '스팸의 짭조름함과 계란의 고소함이 조화로운 초간단 볶음밥',
    time: '12분',
    difficulty: '쉬움',
    required: ['스팸/햄', '달걀', '밥', '대파', '간장'],
    steps: [
      '스팸을 작게 사각으로 썰고, 대파는 송송 썰어줍니다.',
      '마른 팬에 스팸을 넣고 노릇하게 볶아 기름을 뺀 후 그릇에 따로 덜어둡니다.',
      '같은 팬에 대파를 볶아 향을 내고, 대파를 밀어놓은 뒤 한쪽에 달걀을 스크램블 합니다.',
      '밥과 구운 스팸을 넣고 주걱으로 섞은 뒤 간장 1스푼을 팬 가장자리에 태우듯 뿌려 향을 섞습니다.',
      '재료들이 뭉치지 않도록 골고루 잘 볶아 마무리합니다.'
    ]
  },
  {
    id: 'rec_13',
    name: '돼지고기 김치찌개',
    description: '신김치와 돼지고기를 푹 끓여내 국물이 칼칼하고 시원한 찌개',
    time: '25분',
    difficulty: '보통',
    required: ['김치', '돼지고기', '두부', '대파', '마늘'],
    steps: [
      '냄비에 한입 크기로 썬 돼지고기를 넣고 김치와 다진 마늘과 함께 달달 볶아줍니다.',
      '김치가 나른하게 숨이 죽고 고기 겉면이 익으면 물을 충분히 붓고 센불에서 끓입니다.',
      '찌개가 끓어오르면 중불로 줄여 국물에 깊은 맛이 우러날 때까지 15분 이상 푹 끓입니다.',
      '도톰하게 썬 두부와 어긋 썬 대파를 넣고 한소끔 더 보글보글 끓여 완성합니다.'
    ]
  },
  {
    id: 'rec_14',
    name: '해장 파라면',
    description: '대파를 듬뿍 넣고 얼큰함을 한 층 극대화한 국물 라면 요리',
    time: '7분',
    difficulty: '쉬움',
    required: ['라면', '대파', '달걀'],
    steps: [
      '냄비에 물을 정량 붓고 건더기 스프와 분말 스프를 먼저 넣고 팔팔 끓여줍니다.',
      '물이 끓으면 라면 면을 넣고 꼬들꼬들한 면발을 위해 수시로 면을 건졌다 들었다 반복합니다.',
      '송송 썬 대파를 한 줌 듬뿍 넣어 시원하고 개운한 향을 가미합니다.',
      '다 끓기 1분 전에 달걀을 풀지 않고 얌전히 깨 넣어 반숙 느낌으로 한소끔 더 끓여 냅니다.'
    ]
  }
];

// --------------------------------------------------------------------------
// 3. Application State & Storage Sync
// --------------------------------------------------------------------------
let state = {
  ingredients: [],
  shoppingList: [],
  currentFilter: 'all',
  theme: 'light'
};

// Generate UUID-like short ID
function generateId() {
  return 'ing_' + Math.random().toString(36).substr(2, 9);
}

// Save State to LocalStorage
function saveStateToStorage() {
  localStorage.setItem('refrigerator_recipe_manager_state', JSON.stringify(state));
}

// Load State from LocalStorage
function loadStateFromStorage() {
  const saved = localStorage.getItem('refrigerator_recipe_manager_state');
  if (saved) {
    try {
      state = JSON.parse(saved);
      // Fallback arrays if missing
      if (!state.ingredients) state.ingredients = [];
      if (!state.shoppingList) state.shoppingList = [];
      if (!state.currentFilter) state.currentFilter = 'all';
      if (!state.theme) state.theme = 'light';
    } catch (e) {
      console.error('Failed to parse storage state. Starting fresh.', e);
    }
  }
}

// --------------------------------------------------------------------------
// 4. Date & Expiry Helper Functions
// --------------------------------------------------------------------------
function calculateDDay(expiryDateStr) {
  if (!expiryDateStr || expiryDateStr === 'unknown') {
    return { days: null, status: 'unknown', text: '유통기한 모름' };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { days: diffDays, status: 'expired', text: '유통기한 지남', dDayText: `D+${Math.abs(diffDays)}` };
  } else if (diffDays === 0) {
    return { days: diffDays, status: 'urgent', text: '오늘까지', dDayText: 'D-Day' };
  } else if (diffDays >= 1 && diffDays <= 3) {
    return { days: diffDays, status: 'urgent', text: '임박', dDayText: `D-${diffDays}` };
  } else {
    return { days: diffDays, status: 'safe', text: '여유 있음', dDayText: `D-${diffDays}` };
  }
}

// --------------------------------------------------------------------------
// 5. Element Selectors
// --------------------------------------------------------------------------
// Header Dashboard
const statTotalValue = document.querySelector('#stat-total-ingredients .stat-value');
const statUrgentValue = document.querySelector('#stat-urgent-ingredients .stat-value');
const statUrgentCard = document.querySelector('#stat-urgent-ingredients');
const statRecipesValue = document.querySelector('#stat-available-recipes .stat-value');
const themeToggleBtn = document.querySelector('#theme-toggle-btn');

// Fridge Section
const addIngredientBtn = document.querySelector('#add-ingredient-btn');
const categoryTabs = document.querySelector('.category-tabs');
const ingredientsGrid = document.querySelector('#ingredients-grid');

// Recipes Section
const recipesGrid = document.querySelector('#recipes-grid');

// Shopping List Section
const shoppingForm = document.querySelector('#shopping-form');
const shoppingInput = document.querySelector('#shopping-input');
const shoppingListEl = document.querySelector('#shopping-list');
const clearCompletedBtn = document.querySelector('#clear-completed-btn');

// Ingredient Modal
const ingredientModal = document.querySelector('#ingredient-modal');
const ingredientForm = document.querySelector('#ingredient-form');
const modalTitle = document.querySelector('#modal-title');
const ingredientIdInput = document.querySelector('#ingredient-id');
const ingredientNameInput = document.querySelector('#ingredient-name');
const ingredientCategorySelect = document.querySelector('#ingredient-category');
const ingredientQuantityInput = document.querySelector('#ingredient-quantity');
const ingredientUnitSelect = document.querySelector('#ingredient-unit');
const ingredientExpiryInput = document.querySelector('#ingredient-expiry');
const expiryUnknownCheckbox = document.querySelector('#ingredient-expiry-unknown');
const nameError = document.querySelector('#name-error');
const expiryError = document.querySelector('#expiry-error');

// Recipe Detail Modal
const recipeModal = document.querySelector('#recipe-modal');
const recipeDetailName = document.querySelector('#recipe-detail-name');
const recipeDetailDesc = document.querySelector('#recipe-detail-desc');
const recipeDifficulty = document.querySelector('#recipe-difficulty');
const recipeTime = document.querySelector('#recipe-time');
const recipeIngredientsChecklist = document.querySelector('#recipe-ingredients-checklist');
const recipeStepsList = document.querySelector('#recipe-steps-list');
const cookCompleteBtn = document.querySelector('#cook-complete-btn');

// Current viewing recipe in detail modal (for subtraction)
let currentRecipeObj = null;

// --------------------------------------------------------------------------
// 6. UI Render Engines
// --------------------------------------------------------------------------

// Render Dashboard values
function renderDashboard() {
  statTotalValue.textContent = state.ingredients.length;
  
  // Count urgent & expired
  let urgentCount = 0;
  state.ingredients.forEach(ing => {
    const dDay = calculateDDay(ing.expiry);
    if (dDay.status === 'expired' || dDay.status === 'urgent') {
      urgentCount++;
    }
  });
  
  statUrgentValue.textContent = urgentCount;
  if (urgentCount > 0) {
    statUrgentCard.classList.add('alert-pulse');
  } else {
    statUrgentCard.classList.remove('alert-pulse');
  }
}

// Render Ingredients List
function renderIngredients() {
  const filter = state.currentFilter;
  
  // Filter list
  const filtered = state.ingredients.filter(ing => {
    if (filter === 'all') return true;
    return ing.category === filter;
  });

  // Empty state check
  if (filtered.length === 0) {
    ingredientsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-carrot"></i></div>
        <p>${filter === 'all' ? '등록된 재료가 없습니다.' : `${filter} 카테고리에 재료가 없습니다.`}</p>
        <span>${filter === 'all' ? '오른쪽 상단 "재료 추가" 버튼을 눌러 등록해주세요!' : '다른 필터를 선택하거나 새 재료를 추가해 보세요.'}</span>
      </div>
    `;
    return;
  }

  // Generate cards
  ingredientsGrid.innerHTML = filtered.map(ing => {
    const dDay = calculateDDay(ing.expiry);
    let statusClass = '';
    let textClass = '';
    
    if (dDay.status === 'expired') {
      statusClass = 'status-expired';
      textClass = 'expired-text';
    } else if (dDay.status === 'urgent') {
      statusClass = 'status-urgent';
      textClass = 'urgent-text';
    } else if (dDay.status === 'safe') {
      statusClass = 'status-safe';
      textClass = 'safe-text';
    } else {
      statusClass = 'status-unknown';
      textClass = 'unknown-text';
    }

    const categoryIcon = getCategoryIcon(ing.category);
    const dDayDisplay = dDay.days === null ? '모름' : dDay.dDayText;

    return `
      <div class="ingredient-card" data-id="${ing.id}">
        <div class="ingredient-header">
          <span class="ingredient-cat-badge">${categoryIcon} ${ing.category}</span>
          <div class="ingredient-actions">
            <button class="action-btn edit-btn" onclick="openEditIngredientModal('${ing.id}')" title="수정">
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteIngredient('${ing.id}')" title="삭제">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <div class="ingredient-info">
          <h4 class="ingredient-name" title="${ing.name}">${ing.name}</h4>
          <p class="ingredient-quantity-display">${ing.quantity} ${ing.unit}</p>
        </div>
        <div class="ingredient-expiry-status">
          <span class="expiry-days ${textClass}">${dDayDisplay}</span>
          <span class="status-badge ${statusClass}">${dDay.text}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Return category icon emoji/markup
function getCategoryIcon(cat) {
  switch (cat) {
    case '채소': return '🥦';
    case '고기': return '🥩';
    case '해산물': return '🐟';
    case '유제품': return '🥛';
    case '곡류': return '🌾';
    case '소스': return '🍯';
    default: return '🥫';
  }
}

// Render Recommendations list
function renderRecipes() {
  // Create owned normalized mapping for O(1) matching checks
  const ownedNormalizedMap = {};
  state.ingredients.forEach(ing => {
    const norm = normalizeIngredient(ing.name);
    ownedNormalizedMap[norm] = true;
  });

  const recommendations = [];

  RECIPE_DATABASE.forEach(recipe => {
    let matchCount = 0;
    const requiredItems = recipe.required;
    
    const details = requiredItems.map(req => {
      const norm = normalizeIngredient(req);
      const isOwned = !!ownedNormalizedMap[norm];
      if (isOwned) matchCount++;
      return { name: req, isOwned };
    });

    const matchScore = Math.round((matchCount / requiredItems.length) * 100);

    // Only recommend if there is at least one matching ingredient
    if (matchCount > 0) {
      recommendations.push({
        ...recipe,
        details,
        matchScore,
        matchCount
      });
    }
  });

  // Sort recommendations:
  // 1. Highest match score (%) first
  // 2. If same score, sort by name
  recommendations.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.name.localeCompare(b.name);
  });

  // Update badge count
  statRecipesValue.textContent = recommendations.length;

  if (recommendations.length === 0) {
    recipesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-burger"></i></div>
        <p>추천할 수 있는 레시피가 없습니다.</p>
        <span>냉장고에 요리 재료를 등록해 주시면 매칭을 진행합니다.</span>
      </div>
    `;
    return;
  }

  recipesGrid.innerHTML = recommendations.map(recipe => {
    const isPerfect = recipe.matchScore === 100;
    
    // Preview of ingredient pills
    const pillsHTML = recipe.details.map(item => {
      return `
        <span class="ingredient-pill ${item.isOwned ? 'owned' : 'missing'}">
          ${item.isOwned ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-question"></i>'} ${item.name}
        </span>
      `;
    }).join('');

    return `
      <div class="recipe-card">
        <div class="recipe-header-block">
          <div class="recipe-meta-badges">
            <span class="recipe-badge level"><i class="fa-solid fa-star"></i> ${recipe.difficulty}</span>
            <span class="recipe-badge"><i class="fa-solid fa-clock"></i> ${recipe.time}</span>
          </div>
          <h4 class="recipe-card-title">${recipe.name}</h4>
        </div>

        <div class="recipe-ingredients-preview">
          ${pillsHTML}
        </div>

        <div class="recipe-match-indicator">
          <div class="match-text-row">
            <span>재료 매칭률</span>
            <span class="match-percentage">${recipe.matchScore}%</span>
          </div>
          <div class="match-bar-bg">
            <div class="match-bar-fill" style="width: ${recipe.matchScore}%"></div>
          </div>
        </div>

        <button class="btn btn-outline" onclick="openRecipeDetailModal('${recipe.id}')">
          <i class="fa-solid fa-circle-info"></i> 상세 레시피 보기
        </button>
      </div>
    `;
  }).join('');
}

// Render Shopping list
function renderShoppingList() {
  if (state.shoppingList.length === 0) {
    shoppingListEl.innerHTML = `
      <li class="shopping-empty">
        <i class="fa-solid fa-clipboard-list"></i>
        <p>장보기 목록이 비어있습니다.</p>
      </li>
    `;
    return;
  }

  shoppingListEl.innerHTML = state.shoppingList.map(item => {
    return `
      <li class="shopping-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
        <div class="shopping-item-left" onclick="toggleShoppingItem('${item.id}')">
          <input type="checkbox" ${item.completed ? 'checked' : ''} onclick="event.stopPropagation(); toggleShoppingItem('${item.id}')">
          <span class="shopping-item-name">${item.name}</span>
        </div>
        <button class="action-btn delete-btn" onclick="deleteShoppingItem('${item.id}')" title="삭제">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 7. Modal Handlers
// --------------------------------------------------------------------------
function openAddIngredientModal() {
  modalTitle.textContent = '재료 추가';
  ingredientIdInput.value = '';
  ingredientForm.reset();
  
  // Enable date field by default
  ingredientExpiryInput.disabled = false;
  
  clearFormValidationErrors();
  
  // Show Modal
  ingredientModal.classList.remove('hidden');
  ingredientNameInput.focus();
}

function openEditIngredientModal(id) {
  const ing = state.ingredients.find(item => item.id === id);
  if (!ing) return;

  modalTitle.textContent = '재료 수정';
  ingredientIdInput.value = ing.id;
  ingredientNameInput.value = ing.name;
  ingredientCategorySelect.value = ing.category;
  ingredientQuantityInput.value = ing.quantity;
  ingredientUnitSelect.value = ing.unit;
  
  if (ing.expiry === 'unknown' || !ing.expiry) {
    expiryUnknownCheckbox.checked = true;
    ingredientExpiryInput.value = '';
    ingredientExpiryInput.disabled = true;
  } else {
    expiryUnknownCheckbox.checked = false;
    ingredientExpiryInput.value = ing.expiry;
    ingredientExpiryInput.disabled = false;
  }

  clearFormValidationErrors();
  
  ingredientModal.classList.remove('hidden');
  ingredientNameInput.focus();
}

function closeIngredientModal() {
  ingredientModal.classList.add('hidden');
}

function clearFormValidationErrors() {
  document.querySelectorAll('.form-group').forEach(el => {
    el.classList.remove('has-error', 'shake-input');
  });
}

// Recipe Detail Modal Renderer
function openRecipeDetailModal(id) {
  const recipe = RECIPE_DATABASE.find(item => item.id === id);
  if (!recipe) return;

  currentRecipeObj = recipe;

  recipeDetailName.textContent = recipe.name;
  recipeDetailDesc.textContent = recipe.description;
  recipeDifficulty.innerHTML = `<i class="fa-solid fa-star"></i> ${recipe.difficulty}`;
  recipeTime.innerHTML = `<i class="fa-solid fa-clock"></i> ${recipe.time}`;

  // Populate Ingredients Checklist
  const ownedNormalizedMap = {};
  state.ingredients.forEach(ing => {
    const norm = normalizeIngredient(ing.name);
    ownedNormalizedMap[norm] = true;
  });

  // Calculate items in shopping list for disabling plus button
  const shoppingItemsNormalized = {};
  state.shoppingList.forEach(item => {
    const norm = normalizeIngredient(item.name);
    shoppingItemsNormalized[norm] = true;
  });

  recipeIngredientsChecklist.innerHTML = recipe.required.map(req => {
    const norm = normalizeIngredient(req);
    const isOwned = !!ownedNormalizedMap[norm];
    const isAlreadyShopping = !!shoppingItemsNormalized[norm];

    let actionHTML = '';
    if (isOwned) {
      actionHTML = `<span class="added-shop-badge" title="이미 보유 중인 재료입니다."><i class="fa-solid fa-check"></i> 보유중</span>`;
    } else if (isAlreadyShopping) {
      actionHTML = `<span class="added-shop-badge" style="color: var(--text-secondary);" title="이미 장보기 목록에 있습니다."><i class="fa-solid fa-cart-flatbed"></i> 담김</span>`;
    } else {
      // Escape req string for safe onclick
      const escapedName = req.replace(/'/g, "\\'");
      actionHTML = `
        <button class="add-shop-btn" onclick="quickAddShopping('${escapedName}', this)" title="장보기 목록에 추가">
          <i class="fa-solid fa-plus"></i>
        </button>
      `;
    }

    return `
      <li class="recipe-ing-check-item ${isOwned ? 'owned' : ''}">
        <span class="ing-name-check">
          ${isOwned ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-question"></i>'}
          ${req}
        </span>
        ${actionHTML}
      </li>
    `;
  }).join('');

  // Populate Cooking Steps Checklist
  recipeStepsList.innerHTML = recipe.steps.map((step, index) => {
    return `
      <li class="recipe-step-item" onclick="toggleCookingStep(this)">
        <input type="checkbox" onclick="event.stopPropagation(); toggleCookingStep(this.parentElement)">
        <div class="recipe-step-content">
          <span class="recipe-step-number">Step ${index + 1}</span>
          <span class="recipe-step-text">${step}</span>
        </div>
      </li>
    `;
  }).join('');

  // Show recipe modal
  recipeModal.classList.remove('hidden');
}

function closeRecipeDetailModal() {
  recipeModal.classList.add('hidden');
  currentRecipeObj = null;
}

function toggleCookingStep(element) {
  element.classList.toggle('checked');
  const checkbox = element.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = element.classList.contains('checked');
  }
}

// --------------------------------------------------------------------------
// 8. CRUDS & Operations for Ingredients
// --------------------------------------------------------------------------

// Form submission handler (Save)
function saveIngredient(event) {
  event.preventDefault();
  clearFormValidationErrors();

  const id = ingredientIdInput.value;
  const name = ingredientNameInput.value.trim();
  const category = ingredientCategorySelect.value;
  const quantityInputVal = parseInt(ingredientQuantityInput.value, 10);
  const quantity = isNaN(quantityInputVal) || quantityInputVal < 1 ? 1 : quantityInputVal;
  const unit = ingredientUnitSelect.value;
  const isUnknown = expiryUnknownCheckbox.checked;
  const expiryDate = ingredientExpiryInput.value;

  let isValid = true;

  // 1. Name Check
  if (!name) {
    const group = ingredientNameInput.parentElement;
    group.classList.add('has-error', 'shake-input');
    isValid = false;
  }

  // 2. Expiry Check
  let finalExpiry = 'unknown';
  if (!isUnknown) {
    if (!expiryDate) {
      // Empty input is treated as "unknown" implicitly or should warn?
      // Requirement: "유통기한을 모르는 경우에는 '모름'을 선택... 그 외엔 날짜 선택"
      // If they didn't pick a date and didn't check "unknown", we warn them or default to unknown?
      // Let's force them to select date if "모름" is not checked.
      const group = ingredientExpiryInput.parentElement.parentElement;
      group.classList.add('has-error', 'shake-input');
      expiryError.textContent = '날짜를 입력하시거나 모름을 체크해주세요.';
      isValid = false;
    } else {
      // Past date check
      const today = new Date();
      today.setHours(0,0,0,0);
      const selected = new Date(expiryDate);
      selected.setHours(0,0,0,0);
      
      if (selected.getTime() < today.getTime()) {
        const group = ingredientExpiryInput.parentElement.parentElement;
        group.classList.add('has-error', 'shake-input');
        expiryError.textContent = '이미 지난 날짜입니다.';
        isValid = false;
      } else {
        finalExpiry = expiryDate;
      }
    }
  }

  if (!isValid) {
    // Remove shake animation class after 400ms to allow shaking again next time
    setTimeout(() => {
      document.querySelectorAll('.shake-input').forEach(el => el.classList.remove('shake-input'));
    }, 400);
    return;
  }

  if (id) {
    // Edit Mode
    const index = state.ingredients.findIndex(item => item.id === id);
    if (index !== -1) {
      state.ingredients[index] = {
        id,
        name,
        category,
        quantity,
        unit,
        expiry: finalExpiry
      };
    }
  } else {
    // Add Mode
    const newIngredient = {
      id: generateId(),
      name,
      category,
      quantity,
      unit,
      expiry: finalExpiry
    };
    state.ingredients.push(newIngredient);
  }

  // Save & Refresh UI
  saveStateToStorage();
  closeIngredientModal();
  renderDashboard();
  renderIngredients();
  renderRecipes();
}

// Delete Ingredient
function deleteIngredient(id) {
  const ing = state.ingredients.find(item => item.id === id);
  if (!ing) return;
  
  if (confirm(`정말 '${ing.name}' 재료를 삭제하시겠습니까?`)) {
    // Animate removal: find element and fade it out before actual delete
    const cardEl = document.querySelector(`.ingredient-card[data-id="${id}"]`);
    if (cardEl) {
      cardEl.style.opacity = '0';
      cardEl.style.transform = 'translateY(10px)';
      setTimeout(() => {
        state.ingredients = state.ingredients.filter(item => item.id !== id);
        saveStateToStorage();
        renderDashboard();
        renderIngredients();
        renderRecipes();
      }, 250);
    } else {
      state.ingredients = state.ingredients.filter(item => item.id !== id);
      saveStateToStorage();
      renderDashboard();
      renderIngredients();
      renderRecipes();
    }
  }
}

// --------------------------------------------------------------------------
// 9. Shopping List Operations
// --------------------------------------------------------------------------

// Add Item
function addShoppingItem(event) {
  event.preventDefault();
  const name = shoppingInput.value.trim();
  if (!name) return;

  // Avoid duplicates
  const exists = state.shoppingList.some(item => normalizeIngredient(item.name) === normalizeIngredient(name));
  if (exists) {
    alert(`'${name}'은(는) 이미 장보기 목록에 있습니다.`);
    shoppingInput.value = '';
    return;
  }

  const newItem = {
    id: 'shop_' + Math.random().toString(36).substr(2, 9),
    name: name,
    completed: false
  };

  state.shoppingList.push(newItem);
  saveStateToStorage();
  shoppingInput.value = '';
  renderShoppingList();
}

// Toggle Check/Uncheck
function toggleShoppingItem(id) {
  const item = state.shoppingList.find(i => i.id === id);
  if (item) {
    item.completed = !item.completed;
    saveStateToStorage();
    renderShoppingList();
  }
}

// Delete individual item
function deleteShoppingItem(id) {
  state.shoppingList = state.shoppingList.filter(item => item.id !== id);
  saveStateToStorage();
  renderShoppingList();
}

// Clear completed items
function clearCompletedShoppingItems() {
  const completedCount = state.shoppingList.filter(item => item.completed).length;
  if (completedCount === 0) {
    alert('완료 처리된 장보기 항목이 없습니다.');
    return;
  }

  state.shoppingList = state.shoppingList.filter(item => !item.completed);
  saveStateToStorage();
  renderShoppingList();
}

// Quick Add Missing from Recipe Detail Modal
function quickAddShopping(name, buttonElement) {
  const exists = state.shoppingList.some(item => normalizeIngredient(item.name) === normalizeIngredient(name));
  if (!exists) {
    const newItem = {
      id: 'shop_' + Math.random().toString(36).substr(2, 9),
      name: name,
      completed: false
    };
    state.shoppingList.push(newItem);
    saveStateToStorage();
    renderShoppingList();
  }

  // Update button inline to show success
  if (buttonElement) {
    const parent = buttonElement.parentElement;
    buttonElement.remove();
    parent.innerHTML = `<span class="added-shop-badge" style="color: var(--text-secondary);"><i class="fa-solid fa-cart-flatbed"></i> 담김</span>`;
  }
}

// --------------------------------------------------------------------------
// 10. Recipe Cooking Completion (Ingredient Subtraction)
// --------------------------------------------------------------------------
function completeCooking() {
  if (!currentRecipeObj) return;

  const requiredNormalizedList = currentRecipeObj.required.map(req => normalizeIngredient(req));
  
  // Find which of our ingredients in fridge match the required ingredients
  const matchingIngredients = [];
  state.ingredients.forEach(ing => {
    const norm = normalizeIngredient(ing.name);
    if (requiredNormalizedList.includes(norm)) {
      matchingIngredients.push(ing);
    }
  });

  if (matchingIngredients.length === 0) {
    alert('이 요리를 만들기 위해 냉장고에서 소모할 수 있는 매칭 재료가 없습니다.');
    return;
  }

  const ingNamesStr = matchingIngredients.map(ing => ing.name).join(', ');
  if (confirm(`'${currentRecipeObj.name}' 요리를 완료하셨습니까?\n\n소모된 재료 (${ingNamesStr})의 냉장고 보관 수량을 1개씩 차감합니다.`)) {
    
    // Decrement or delete matching ingredients
    matchingIngredients.forEach(matchingIng => {
      const idx = state.ingredients.findIndex(i => i.id === matchingIng.id);
      if (idx !== -1) {
        state.ingredients[idx].quantity -= 1;
        // If quantity drops to 0, remove the ingredient card
        if (state.ingredients[idx].quantity <= 0) {
          state.ingredients.splice(idx, 1);
        }
      }
    });

    saveStateToStorage();
    closeRecipeDetailModal();
    renderDashboard();
    renderIngredients();
    renderRecipes();
  }
}

// --------------------------------------------------------------------------
// 11. Theme Controls
// --------------------------------------------------------------------------
function toggleTheme() {
  if (state.theme === 'light') {
    state.theme = 'dark';
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    state.theme = 'light';
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
  saveStateToStorage();
}

function applyThemeOnLoad() {
  if (state.theme === 'dark') {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

// --------------------------------------------------------------------------
// 12. Setup & Event Listeners
// --------------------------------------------------------------------------

// Category Filtering Setup
categoryTabs.addEventListener('click', (e) => {
  const button = e.target.closest('.tab-btn');
  if (!button) return;

  // Toggle active styling
  categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  button.classList.add('active');
  button.setAttribute('aria-selected', 'true');

  state.currentFilter = button.getAttribute('data-category');
  saveStateToStorage();
  renderIngredients();
});

// Modals toggles
addIngredientBtn.addEventListener('click', openAddIngredientModal);

document.querySelectorAll('.close-modal-btn, .cancel-modal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeIngredientModal();
    closeRecipeDetailModal();
  });
});

// Close modals when clicking overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeIngredientModal();
      closeRecipeDetailModal();
    }
  });
});

// Form Submits
ingredientForm.addEventListener('submit', saveIngredient);
shoppingForm.addEventListener('submit', addShoppingItem);

// Expiry unknown checkbox handler
expiryUnknownCheckbox.addEventListener('change', () => {
  if (expiryUnknownCheckbox.checked) {
    ingredientExpiryInput.disabled = true;
    ingredientExpiryInput.value = '';
    ingredientExpiryInput.parentElement.parentElement.classList.remove('has-error');
  } else {
    ingredientExpiryInput.disabled = false;
  }
});

// Buttons click binding
clearCompletedBtn.addEventListener('click', clearCompletedShoppingItems);
cookCompleteBtn.addEventListener('click', completeCooking);
themeToggleBtn.addEventListener('click', toggleTheme);

// Initialize App
function initApp() {
  loadStateFromStorage();
  applyThemeOnLoad();
  renderDashboard();
  renderIngredients();
  renderRecipes();
  renderShoppingList();
  
  // Set default category filter tab to active
  const activeTab = categoryTabs.querySelector(`[data-category="${state.currentFilter}"]`);
  if (activeTab) {
    categoryTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    activeTab.classList.add('active');
  }
}

// Kickstart
document.addEventListener('DOMContentLoaded', initApp);
