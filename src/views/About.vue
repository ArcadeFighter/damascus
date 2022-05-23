<template>
  <transition name="fade">
    <div class="about container" v-show="show">
      <h3>Jednoduchý, lehký a intuitivní tracker na kamufláže, reticly a Master Challenge z Call of Duty: Modern Warfare (2019)</h3>
      <p>Sleduj svůj progress Damascus kamufláž, Reticle nebo Mastery challenge s tímto jednoduchým trackerem.</p>

      <div class="features">
        <div class="feature" v-for="feature in features" :key="feature.title">
          <eva-icon :name="feature.icon" fill="black" width="75" height="75"></eva-icon>
          <h5>{{ feature.title }}</h5>
          <p>{{ feature.description }}</p>
        </div>
      </div>

      <h4>Je to Open source</h4>
      <p>Aplikace je postavena na <a href="https://vuejs.org/">Vue</a> a hostovaná na <a href="https://vercel.com/">Vercel</a>. Kód stránky je dostupný na <a href="https://github.com/carlssonemil/damascus">GitHubu</a>.</p>
    
      <h4>Tracker pro DM Ultra a Dark Aether</h4>
      <p>Hledáš tracker na kamufláže z <i>Call of Duty: Black Ops Cold War</i>? Najdeš ho <a href="https://coldwar.arcadex.cz">TADY</a>.</p>
    
      <h4>Tracker pro Atomic a Dark Aether</h4>
      <p>Hledáš tracker na kamufláže z <i>Call of Duty: Vanguard</i>? Najdeš ho <a href="https://vanguard.arcadex.cz">TADY</a>.</p>

      <h4>Připoj se na náš Discord</h4>
      <p>Chceš vědět víc informací o Call of Duty? Tak se připoj na náš <a href="https://discord.gg/adisbak">Discord</a>! Buď součástí velké Call of Duty komunity!</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'about',

  data() {
    return {
      show: false,
      features: [
        {
          title: 'Automatické ukládání',
          description: 'Tvůj progress se automaticky úkladá.',
          icon: 'save-outline'
        },
        {
          title: 'Responzivní',
          description: 'Můžeš použít i svůj telefon na tento tracker.',
          icon: 'smartphone-outline'
        },
        {
          title: 'Export/Import',
          description: 'Exportuj svůj progress do jiného zařízení nebo prohlížeče.',
          icon: 'external-link-outline'
        }
      ]
    }
  },

  mounted() {
    this.show = true;
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 18px;

  @media (max-width: $tablet) {
    font-size: 16px;
  }
}

a {
  @media (max-width: $tablet) {
    font-size: 16px;
  }
}

.features {
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(3, 1fr);
  margin: 30px 0;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
  }

  .feature {
    background: $elevation-2-color;
    border-radius: $border-radius;
    cursor: default;
    overflow: hidden;
    padding: 20px;
    position: relative;
    transition: $transition;

    &:hover {
      background: $elevation-3-color;
    }

    i {
      bottom: 0;
      opacity: .35;
      position: absolute;
      right: 0;
      transform: translate(0%, 40%);
      z-index: 1;
    }

    h5 {
      font-weight: 600;
      margin-bottom: 10px;
      position: relative;
      z-index: 2;
    }

    p {
      font-size: 16px;
      line-height: 1.4;
      position: relative;
      z-index: 2;
    }
  }
}
</style>