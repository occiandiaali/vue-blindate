<template>
  <section class="section">
    <h1>About us</h1>
    <p>
      /ˈblaɪndeɪt/. is the new way to find your (near) perfect match online.
    </p>
    <p>
      Dating apps focus on the ephemeral - typically physical attributes - and
      we believe that's the problem.
    </p>
    <p>
      People want (life)long-lasting romance, and such cannot be gotten by
      reliance on surface-level factors. We look for what's beneath the surface,
      because that's what really lasts.
    </p>
    <p>
      Click More for a showreel on how we help you find that person who is truly
      your soulmate..
    </p>
    <button
      type="button"
      class="btn btn-info"
      data-bs-toggle="modal"
      data-bs-target="#reelModal"
    >
      More
    </button>
    <div
      class="modal fade"
      id="reelModal"
      tabindex="-1"
      aria-labelledby="reelModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Example /ˈblaɪndeɪt/. show reel
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!--Carousel section-->
            <div id="carouselExampleIndicators" class="carousel slide">
              <div class="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  class="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <!-- <img src="..." class="d-block w-100" alt="..." /> -->
                  <video
                    controls
                    src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
                    width="620"
                  >
                    Sorry, your browser doesn't support embedded videos, but
                    don't worry, you can
                    <a href="https://archive.org/details/BigBuckBunny_124"
                      >download it</a
                    >
                    and watch it with your favorite video player!
                  </video>
                </div>
                <div class="carousel-item">
                  <!-- <img src="..." class="d-block w-100" alt="..." /> -->
                  <video
                    controls
                    src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
                    poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
                    width="620"
                  >
                    Sorry, your browser doesn't support embedded videos, but
                    don't worry, you can
                    <a href="https://archive.org/details/BigBuckBunny_124"
                      >download it</a
                    >
                    and watch it with your favorite video player!
                  </video>
                </div>
                <div class="carousel-item">
                  <!-- <img src="..." class="d-block w-100" alt="..." /> -->
                  <video
                    controls
                    poster="https://upload.wikimedia.org/wikipedia/commons/e/e8/Elephants_Dream_s5_both.jpg"
                    width="620"
                  >
                    <source
                      src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
                      type="video/mp4"
                    />
                    Sorry, your browser doesn't support embedded videos, but
                    don't worry, you can
                    <a href="https://archive.org/details/BigBuckBunny_124"
                      >download it</a
                    >
                    and watch it with your favorite video player!
                  </video>
                </div>
              </div>
              <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
            <!---->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
.section {
  margin-top: 10%;
}

@media screen and (max-width: 750px) {
  .section {
    margin-top: 25%;
  }
}
</style>
