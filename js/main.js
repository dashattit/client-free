// компонент для самой карточки
Vue.component('card', {
    props: ['title'],
    template: `
    <div class="card">
        <div class="card-header">
            <span>{{ card.title }}</span>
        </div>
        <div class="card-content">
            <p>{{ card.description }}</p>
        </div>
    </div>
    `,
})


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
        ]
    }
})