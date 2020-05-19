<template>
    <div id="fundraiseup-form">
        <h1>Secure Donation</h1>
        <div class="suggestions">
            <button
                    v-for="preset in presets"
                    v-on:click="setValue(preset)"
                    v-bind:class="isActive(preset)"
            >
                {{beautify(preset)}} {{currentCurrency.symbol}}
            </button>
        </div>
        <input type="number"
               v-model.number="value"
               placeholder="Other.."
               @keypress="isNumber($event)"
        >
        <select
                name="currencies"
                id="currencies"
                @change="changeCurrency($event)"
        >
            <option v-for="(option, index) in currencies" v-bind:value=index>
                {{option.symbol}} | {{ option.name }}
            </option>
        </select>
        <button v-on:click="submit">Submit</button>
    </div>
</template>

<script>
    import axios from 'axios';

    const presets = [40, 100, 200, 1000, 2500, 5000];
    const suggestion = 40;

    const currencies = [
        {name: "US Dollar", code: "USD", symbol: "$", rate: 1},
        {name: "Euro", code: "EUR", symbol: "€", rate: 0.897597},
        {name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755},
        {name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993}
    ];

    export default {
        name: 'app',
        methods: {
            beautify(val) {
                return new Intl.NumberFormat('en-US').format(val);
            },
            isNumber: function (event) {
                if (event.key >= 0 || event.key <= 9) {
                    return true;
                }

                event.preventDefault();
            },
            submit() {
                if (this.value <= 0 || isNaN(this.value)) {
                    return;
                }

                axios.post('/donate', {
                    amount: this.value,
                    currency: this.currentCurrency.code
                }).then(function (response) {
                    if (201 === response.status) {
                        alert('Thank you for your donation!');
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            isActive: function (val) {
                return {
                    active: val === this.value
                };
            },
            setValue(value) {
                this.value = value;
            },
            changeCurrency(event) {
                this.currentCurrency = this.currencies[event.target.value];
                this.presets = [];

                presets.forEach((item, index) => {
                    this.presets.push(this.currencyRate(item));
                });
            },
            currencyRate(val) {
                let rate = Math.round(val * this.currentCurrency.rate);
                let pow = Math.pow(10, rate.toString().length - 1);

                return Math.floor(rate / pow) * pow;
            }
        },
        data() {
            return {
                value: suggestion,
                currentCurrency: currencies[0],
                currencies: currencies,
                presets: presets
            }
        }
    }
</script>
