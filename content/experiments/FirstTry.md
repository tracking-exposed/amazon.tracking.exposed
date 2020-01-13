---
title: First Experiment!
subtitle: This page should be written by a researcher 
date: 2020-01-10T15:01:21+01:00
draft: false
description: First experiment
extraCSS: "/css/experiments.css"

og_title: "First experiment for reproducible algorthim analysis"
og_type: "website"
og_image: "http://amazon.tracking.exposed/amtrex-logo.jpg"
og_url: "https://amazon.tracking.exposed/experiments/firsttry"
og_description: "If you read this: it is weird"
---

## Description 

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.


## Actions

<p> 
<!-- this should be only one P element after id='action' 
     the id's MUST start from id-0 and have incremental number -->

{{< experiment 
  id="id-1"
  href="https://www.amazon.com/Mardi-viaggio-laggi%C3%B9-Herman-MELVILLE/dp/B00900LFOQ/"
  display="Amardi, italian book"
  action="(don't forget to scroll down!)"
>}}

{{< experiment 
  id="id-2"
  href="https://www.amazon.com/JBL-Boombox-Portable-Bluetooth-Waterproof/dp/B0759GC766/"
  display="JBL waterproof boombox"
  action="(againt, don't forget to scroll down!)"
>}}

{{< experiment 
  id="id-3"
  href="https://www.amazon.com/CCUFO-Mechanical-Venetian-Masquerade-Decoration/dp/B078Y7QV4W/" 
  display="Mechanical venetian mask for steampunk cosplay"
  action="(if you scroll down you'll record all the sponsored related products"
>}}

</p>

<div id="activator--form" class="text-center" hidden>
  <h3>You will treat data of participants following the Tracking.Exposed researcher guidelines</h3>
  <button id="activation-button" type="button" class="btn btn-lg btn-success">ACTIVATE</button>
</div>

## Conclusion 

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum ex at sapien mattis finibus. Donec nec turpis eu nisi varius fermentum in in libero. Praesent non vulputate libero. Aenean posuere est turpis, a feugiat lorem convallis nec. Curabitur sit amet sapien sed leo facilisis gravida eu vulputate odio. Etiam ut tortor in metus vestibulum efficitur at eget ex. Proin sit amet lorem porttitor, mattis erat vel, tincidunt metus. Ut nibh eros, ultricies in lorem id, pharetra rhoncus purus. Donec facilisis ligula sed nulla finibus aliquet.

<script type="text/javascript" src="/js/global.js"></script>
<script type="text/javascript" src="/js/experiments.js"></script>
<script type="text/javascript">
  $( document ).ready(dynamicTestPage);
</script>