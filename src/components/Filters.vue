<template>
  <div class="filters">
    <div class="select" v-if="'category' in filters">
      <label for="category">Kategorie</label>
      <select id="category" v-model="filters.category" @change="filterChange()">
        <option value="null">Všechny</option>
        <option v-for="(category, index) in categoryOptions" :key="index" :value="category">
          {{ category }}
        </option>
      </select>
      <eva-icon name="chevron-down" fill="white"></eva-icon>
    </div>

    <div class="checkbox" v-if="'hideCompleted' in filters">
      <label for="hideCompleted" :class="{ checked: filters.hideCompleted }">
        <input id="hideCompleted" type="checkbox" v-model="filters.hideCompleted" @change="filterChange()">
        <span>Schovat splněné</span>
      </label>
    </div>

    <div class="checkbox" v-if="'hideNonRequired' in filters">
      <label for="hideNonRequired" :class="{ checked: filters.hideNonRequired }">
        <input id="hideNonRequired" type="checkbox" v-model="filters.hideNonRequired" @change="filterChange()">
        <span>Schovat nevyžadované</span>
      </label>
    </div>

    <div class="symbols" v-if="showSymbols">
      <div class="symbol damascus" v-if="showSymbols.includes('damascus')">
        <span></span>
        <p>Potřebné pro Damascus</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filters',

  props: ['type', 'showSymbols'],

  computed: {
    filters() {
      return { ...this.$store.state.filters[this.type] };
    },

    categoryOptions() {
      if (this.type === 'challenges') {
        return Array.from(new Set(this.$store.state.weapons.map(i => i.category)));
      } else {
        return Array.from(new Set(this.$store.state[this.type].map(i => i.category)));
      }
    }
  },

  methods: {
    filterChange() {
      let type = this.type;
      let filters = this.filters;

      this.$store.dispatch('setFilters', { type, filters });
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  align-items: center;
  display: flex;
  margin-bottom: 50px;

  @media (max-width: $tablet) {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 30px;
    margin-bottom: 75px;
  }

  > *:not(:first-child) {
    margin-left: 50px;

    @media (max-width: $tablet) {
      margin-left: 0;
      margin-top: 25px;
    }
  }

  > .checkbox:nth-last-of-type(2) {
    flex: 1 1 auto;
  }

  .symbols {
    cursor: default;

    @media (max-width: $tablet) {
      margin-top: 35px;
    }

    .symbol {
      align-items: center;
      display: flex;

      &.damascus {
        span {
          $size: 10px;

          background: $purple;
          border-radius: $size;
          display: block;
          height: $size;
          margin-right: 10px;
          width: $size;

          @media (max-width: $tablet) {
            $size: 15px;

            border-radius: $size;
            height: $size;
            width: $size;
          }
        }

        p {
          color: rgba(white, .35);
          font-size: 14px;
        }
      }
    }
  }

  button {
    align-self: flex-end;
  }
}
</style>