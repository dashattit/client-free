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
            <textarea v-else v-model="card.description" placeholder="Описание задачи">
            <p>Создано: {{ card.createdAt }}</p>
            <p v-if="card.editedAt">Отредактировано: {{ card.editedAt }}</p>
            <p class="deadline" v-if="!isEditing">Дэдлайн: {{ card.editedAt }}</p>
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
            
        </div>
    `,
});

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
    }
})