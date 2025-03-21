// компонент для самой карточки
Vue.component('card', {
    props: ['card', 'index', 'columnIndex', 'isEditing'],
    template: `
    <div class="card">
        <div class="card-header">
            <span v-if="!isEditing">{{ card.title }}</span>
            <input v-else type="text" v-model="card.title" placeholder="Название карточки">
            <button @click="$root.deleteCard(index)" v-if="columnIndex === 0">Удалить</button>
            <button @click="$root.editCard(index)" v-if="columnIndex === 0 && !isEditing">Редактировать</button>
            <button @click="$root.saveCard(index)" v-if="columnIndex === 0 && isEditing">Удалить</button>
            <button @click="$root.moveCard(index)" v-if="columnIndex === 0">Переместить</button>

        </div>
        <div class="card-content">
            <p v-if="!isEditing">{{ card.description }}</p>
            <textarea v-else v-model="card.description" placeholder="Описание задачи">
            <p>Создано: {{ card.createdAt }}</p>
            <p v-if="card.editedAt">Отредактировано: {{ card.editedAt }}</p>
            <p class="deadline" v-if="!isEditing">Дэдлайн: {{ card.deadline }}</p>
            <input v-else type="date" v-model="card.deadline" placeholder="Дэдлайн">
        </div>
    </div>
    `,
});

// компонент для канбан-доски
Vue.component('kanban-task', {
    props: ['columns', 'newCard', 'editingIndex'],
    template: `
        <div class="board">
            <div v-for="(column, columnIndex) in columns :key="columnIndex" class="column">
                <h2>{{ column.title }}</h2>
                <div v-if="columnIndex" === 0>
                    <input type="text" v-model="newCard.title" placeholder="Название карточки"><br><br>
                    <textarea v-model="newCard.description" placeholder="Описание задачи"></textarea><br><br>
                    <input type="date" v-model="newCard.deadline" placeholder="Дэдлайн">
                    <button @click="$root.addCard()">Добавить карточку</button>
                </div><br>
                <card v-for="(card, cardIndex) in column.cards" :key="cardIndex" :card="card" :index="cardIndex" :column-index="columnIndex">
            </div>
        </div>
    `,
});

// главный экземпляр
let app = new Vue({
    el: '#app',
    data: {
        columns: [
            {
                title: "Запланированные задачи",
                card: []
            },
            {
                title: "В работе",
                card: []
            },
            {
                title: "Тестирование",
                card: []
            },
            {
                title: "Выполненные задачи",
                card: []
            }
        ],
        newCard: {
            title: '',
            description: '',
            deadline: '',
            createdAt: '',
            editedAt: ''
        },
        editingIndex: null
    },
    methods: {
        addCard() {
            if (this.newCard && this.newCard.description && this.newCard.deadline) {
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
                };
            }
        },
        deleteCard(index) {
            this.columns[0].cards.splice(index, 1);
        },
        editCard(index) {
            this.editingIndex = index;
        },
        saveCard(index) {
            const card = this.columns[0].cards[index];
            card.editedAt = new Date().toLocaleString();
        },
        moveCard(index) {
            const card = this.columns[0].cards[index];
            this.columns[1].cards.push(card);
        }
    },
    template: `
    <kanban-task :columns="columns" :new-card="newCard" :editing-index="editingIndex"></kanban-task>
    `,
})