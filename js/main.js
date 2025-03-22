// компонент для самой карточки
Vue.component('card', {
    props: ['card', 'index', 'columnIndex', 'isEditing'],
    template: `
    <div class="card">
        <div class="card-header">
            <span v-if="!isEditing">{{ card.title }}</span>
            <input v-else type="text" v-model="card.title" placeholder="Название карточки">
        </div>
        <div class="card-content">
            <p v-if="!isEditing">{{ card.description }}</p>
            <textarea v-else v-model="card.description" placeholder="Описание задачи"></textarea>
            <p>Создано: {{ card.createdAt }}</p>
            <p v-if="card.editedAt">Отредактировано: {{ card.editedAt }}</p>
            <div class="deadline-block">
                <p class="deadline" v-if="!isEditing">Дэдлайн: {{ card.deadline }}</p>
                <input v-else type="date" v-model="card.deadline" placeholder="Дэдлайн">
            </div>
            <p v-if="card.returnReason">Причина возврата: {{ card.returnReason }}</p>
            <div class="card-actions" v-if="isEditing">
                <button @click="$root.saveCard(index, columnIndex)">Сохранить</button>
            </div>
            <div class="card-actions" v-else-if="columnIndex <= 2">  
                <button @click="$root.editCard(index, columnIndex)">Редактировать</button>
                <button v-if="columnIndex === 0" @click="$root.moveCard(index)">Переместить</button>
                <button v-if="columnIndex === 1" @click="$root.moveCardToTest(index)">Переместить в тестирование</button>
                <button v-if="columnIndex === 1" @click="$root.moveCardBack(index)">Переместить назад</button>
                <button v-if="columnIndex === 2" @click="$root.moveCardToDone(index)">Переместить в выполненные</button>
                <button v-if="columnIndex === 2" @click="$root.returnToWork(index)">Вернуть в работу</button>
                <button @click="$root.deleteCard(index, columnIndex)">Удалить</button>
            </div>
            <div class="card-actions" v-else-if="columnIndex === 3">
                <button @click="$root.moveCardBackToTest(index)">Переместить назад в тестирование</button>
                <button @click="$root.deleteCard(index, columnIndex)">Удалить</button>
            </div>
        </div>
    </div>
    `,
});

// компонент для доски
Vue.component('kanban-task', {
    props: ['columns', 'newCard', 'editingIndex', 'editingColumnIndex', 'returnReason'],
    template: `
        <div class="board">
            <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="column">
                <h2>{{ column.title }}</h2>
                <div v-if="columnIndex === 0">
                    <input type="text" v-model="newCard.title" placeholder="Название карточки"><br><br>
                    <textarea v-model="newCard.description" placeholder="Описание задачи"></textarea><br><br>
                    <input type="date" v-model="newCard.deadline" placeholder="Дэдлайн">
                    <button @click="$root.addCard()">Добавить карточку</button>
                </div><br>
                <div v-for="(card, cardIndex) in column.cards" :key="cardIndex">
                    <card :card="card" :index="cardIndex" :column-index="columnIndex" :is-editing="editingIndex === cardIndex && editingColumnIndex === columnIndex"></card>
                    <div v-if="columnIndex === 3" 
                         :style="{ 
                             color: card.status === 'Просрочена' ? 'red' : 'green',
                             fontWeight: 'bold',
                             marginTop: '10px'
                         }">
                        {{ card.status }}
                    </div>
            </div>
        </div>
    `,
});

let app = new Vue({
    el: '#app',
    data: {
        columns: [
            {
                title: "Запланированные задачи",
                cards: [] 
            },
            {
                title: "В работе",
                cards: [] 
            },
            {
                title: "Тестирование",
                cards: [] 
            },
            {
                title: "Выполненные задачи",
                cards: [] 
            }
        ],
        newCard: {
            title: '',
            description: '',
            deadline: '',
            createdAt: '',
            editedAt: ''
        },
        editingIndex: null,
        editingColumnIndex: null,
        returnReason: ''
    },
    methods: {
        // добавление карточки
        addCard() {
            if (this.newCard.title && this.newCard.description && this.newCard.deadline) {
                const card = {
                    title: this.newCard.title,
                    description: this.newCard.description,
                    deadline: this.newCard.deadline,
                    createdAt: new Date().toLocaleString(),
                    editedAt: ""
                };
                this.columns[0].cards.push(card);
                this.newCard = {
                    title: "",
                    description: "",
                    deadline: "",
                    createdAt: "",
                    editedAt: "",
                    status: ""
                };
            }
        },
        // метод для удаления карточки
        deleteCard(index, columnIndex) {
            this.columns[columnIndex].cards.splice(index, 1);
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для редактирования карточки
        editCard(index, columnIndex) {
            this.editingIndex = index;
            this.editingColumnIndex = columnIndex;
        },
        // метод для сохранения изменений
        saveCard(index, columnIndex) {
            const card = this.columns[columnIndex].cards[index];
            card.editedAt = new Date().toLocaleString();
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для перемещения из первого столбца во вторую
        moveCard(index) {
            const card = this.columns[0].cards[index];
            this.columns[1].cards.push(card);
            this.columns[0].cards.splice(index, 1);
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для перемещения в третий столбец
        moveCardToTest(index) {
            const card = this.columns[1].cards[index];
            this.columns[2].cards.push(card);
            this.columns[1].cards.splice(index, 1);
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для перемещения из второго столбца в первый
        moveCardBack(index) {
            const card = this.columns[1].cards[index];
            this.columns[0].cards.push(card);
            this.columns[1].cards.splice(index, 1);
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для перемещения из третьего столбца обратно во второй
        moveCardBackToWork(index) {
            const card = this.columns[2].cards[index];
            this.columns[1].cards.push(card);
            this.columns[2].cards.splice(index, 1);
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для перемещения из третьего в четвертый
        moveCardToDone(index) {
            const card = this.columns[2].cards[index];
            const deadlineDate = new Date(card.deadline);
            const currentDate = new Date();

            if (currentDate > deadlineDate) {
                card.status = "Просрочена";
            } else {
                card.status = "Выполнена в срок";
            }

            this.columns[3].cards.push(card);
            this.columns[2].cards.splice(index, 1);
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для перемещения из четвертой в третью
        moveCardBackToTest(index) {
            const card = this.columns[3].cards[index];
            this.columns[2].cards.push(card);
            this.columns[3].cards.splice(index, 1);
            this.editingIndex = null;
            this.editingColumnIndex = null;
        },
        // метод для возврата "в работу"
        returnToWork(index) {
            this.returnReason = prompt("Введите причину возврата в работу");
            if (this.returnReason) {
                const card = this.columns[2].cards[index];
                card.returnReason = this.returnReason;
                this.columns[1].cards.push(card);
                this.columns[2].cards.splice(index, 1);
                this.editingIndex = null;
                this.editingColumnIndex = null;
            }
        }
    },
    template: `
    <kanban-task :columns="columns" :new-card="newCard" :editing-index="editingIndex" :editing-column-index="editingColumnIndex" :return-reason="returnReason"></kanban-task>
    `,
});