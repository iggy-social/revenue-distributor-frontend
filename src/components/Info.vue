<template>
<div class="d-flex justify-content-center">
  <div class="card text-white bg-primary mb-3 send-tokens-card">
    <div class="card-body text-center">
      <button class="btn btn-primary text-uppercase mb-3">
          Info
      </button>

      <p>
        Recipients automatically receive their share of the revenue as soon as it comes into the RevenueDistributor contract.
      </p>

      <p>
        Managers can add, update, or remove recipients, but cannot add or remove other managers.
      </p>

      <p>
        The contract owner has all the rights of a manager, plus the ability to add or remove managers.
      </p>

    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Info"
}
</script>