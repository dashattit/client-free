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