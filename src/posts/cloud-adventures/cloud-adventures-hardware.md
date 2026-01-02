---
layout: post.webc
subject: "Cloud Adventures: Hardware"
date: 2024-12
tags: [server]
thumbnail: "src/posts/cloud-adventures/hero.jpg"
---

<br />

# Cloud Adventures: Hardware

<br />

<preview src="src/posts/cloud-adventures/hero.jpg"></preview>

<br />
<br />

<blockquote>
This is a series of posts about my self-hosting experience. You are reading this post from this server! Peek the [server](http://localhost:8080/?tags=server) tag to read the rest of the entries.
</blockquote>

<br />
<br />

This a lil walkthrough on my hardware selection for my self-hosted server. This server acts as my personal cloud in my journey to reduce my reliance on centralized third-party services. Peek the self-hosted tag to read more!

<br />

Notably, this is the second iteration of my initial setup, which was a smol Beelink SER5 mini PC. This fantastic tiny machine chugged along pretty well for very little upfront cost. Armed with an NVMe drive and gigabit Ethernet with Wi-Fi support, it has all the doodads needed for a self-hosting starter project.

<br />
<br />

<align>
  <preview src="./src/posts/cloud-adventures/beelink-ser5.jpg"></preview>
  <annotation>Beelink SER5 Pro</annotation>
</align>

<br />
<br />

The overarching objective of this project is to regain some data sovereignty over my data. This includes moving my photos, archives, and services to this server.

<br />

My criteria for parts selection are as follows:

<br />

<list>
<li>Maximize data integrity - Corrupted files are bad.</li>
<li>Portable - I should be able to take it in a car or plane when moving around.</li>
<li>Reasonable availability - We aren't competing with Google, and we don't need five nines here, but the server should be contactable while sitting unattended.</li>
<li>Minimal scalability - I don't foresee supporting additional users in the near future, and my current data needs are small.</li>
<li>Cost - I'm unemployed at this time of writing 🥲</li>
</list>

<br />
<br />

# Storage

<br />

<align>
  <row>
    <preview src="./src/posts/cloud-adventures/lenovo-ssd.jpg"></preview>
    <preview src="./src/posts/cloud-adventures/server-ssd.jpg"></preview>
  </row>
  <annotation>Pair of Lenovo 5210 ION, 3.84TB</annotation>
</align>

<br />
<br />

The most substantial piece of this upgrade! We now wield a pair of <a href="https://lenovopress.lenovo.com/lp1223-thinksystem-5210-entry-6gb-sata-qlc-ssds">Lenovo 5210 ION</a> enterprise drives. These come with some niceties that just aren't available in consumer drivers. As far as I can tell, these are simply rebadged <a href="https://www.mouser.com/datasheet/2/671/MICT_S_A0007312265_1-2574554.pdf">Micron MTFDDAK3T8QDE</a> drives and are reasonably priced. Enterprise drives like these often come with much higher endurance ratings than consumer-spec drives, and features like power loss protection further help protect our data.

<br />

Curiously, these are manufactured in my hometown of Singapore as well. I'm happy to say I have helped contribute to the local economy now :) The move away from the previous paltry SSD we had before tackles my biggest concern from my previous build: bit rot.

<br />

Bit rot is the gradual degradation of data over time due to physical drives succumbing to entropy or the universe scrambling your bits with cosmic rays. With the previous setup, a malicious bit flip could corrupt a file on the system and silently propagate that change to my backups too. The file is now irredeemably damaged, and once the old backups are pruned, the corrupted file is now the source of truth 😱

<br />

Crucially, I copped two drives instead of an individual, larger drive. This is key in our quest for data integrity. We now employ a spanking new filesystem, ZFS, migrating away from our previously naive ext4 setup. ZFS as a filesystem comes with self-healing properties, and by having our drives mirror each other, we have a carbon copy of each individual file! This is handy as the filesystem can generate a checksum for every file, and by comparing any deviation, determine if it needs to ameliorate any bit errors that have sprung up.

<br />
<br />

<blockquote>
In setting up mirror configurations, it is actually recommended to procure drives from different manufacturers. This helps mitigate edge cases such as a manufacturing defect, like a faulty controller, from impacting both drives.
</blockquote>

<br />
<br />

This configuration is gratefully picked up from this <a href="https://jrs-s.net/2015/02/06/zfs-you-should-use-mirror-vdevs-not-raidz/">blog post</a> by JRS System. The mirrored configuration makes it easy to add redundancy by slipping in additional disks or increasing the usable capacity by re-silvering each drive one by one.

<br />
<br />

Finally, the inquisitive among you might wonder why I didn't just opt for spinning rust - a regular hard drive would certainly be cheaper and less susceptible to data loss when left unpowered. Modern flash drives, if left sitting unpowered for a long time, will tend to lose their voltage level and subsequently forget a bit state. But since these drives are intended to be powered on 24/7, this is of little concern.

<br />

What is <strong>important</strong>, however, when self-hosting, is to consider your own personal real world constrains. This might manifest as having an unsteady power supply or spotty network connectivity where you live. Your setup should take into consideration such limitations. For me, the server was being built in a rented apartment, and as such, I might have to shuttle it between places. Having it be of a portable size and using static, non-mechanical parts means fewer parts get rattled about.

<br />
<br />

<blockquote>
The more ambitious of you might consider a network-attached storage, further decentralizing your compute from your data. Again, I couldn't possibly lug a Dell blade server stuffed with hard drives so I shied away from this option.
</blockquote>

<br />
<br />

# Enclosure

<br />

<align>
  <row>
    <preview sizes="preview" src="./src/posts/cloud-adventures/asrock-deskmini.jpg"></preview>
    <preview sizes="preview" src="./src/posts/cloud-adventures/server-cpu.jpg"></preview>
  </row>
  <annotation>ASRock DeskMini X600</annotation>
</align>

<br />
<br />

Inspired by the Beelink's small form factor, I sought after a new chassis that was diminutive in size, yet able to cram the new components. Unsurprisingly, many of these mini-PCs weren't able to accommodate multiple full size 3.5- or 2.5-inch drives, often only supporting the smaller, gum-like M.2. form factor.

<br />

Annoyingly, it turns out that even under the M.2. specifications, the drives come in varying lengths. Most typical SSDs here spot a 22mm width and a length of 80mm (abbreviated as 2280). Enterprise M.2. SSDs are often 110mm in length instead (22110). I struggled, both to find a cost-effective 2280 enterprise SSD or a small motherboard would support the longer form factor.

<br />

With some digging, I landed on the DeskMini. Although nearly double the size of the Beelink, it is still mighty small with a 1.9L footprint. Vitally, the product page made it clear that the frame mounts two 2.5-inch drives! Alongside a bevy of nice quality of life upgrades, 2.5 Gigabit Ethernet, DDR5 support, and a modern AM5 socket, the DeskMini was a good enough fit for my use case. Despite its size pressing dangerously close to a conventional mini-ITX machine, power is supplied through a power brick, meaning no full-fat power supply unit needed!

<br />
<br />

# Boot

<br />

<align>
<column>
<preview sizes="preview" src="./src/posts/cloud-adventures/phison-ssd.jpg"></preview>
</column>
<annotation>Some random Phison SSD</annotation>
</align>

<br />
<br />

Since all my important media will live in the Lenovo drives, the OS boot drive doesn't need any cutting-edge features. I simply nicked an old Phison M.2. SSD from my closet.

<br />
<br />

# Processor

<br />

<align>
<preview src="src/posts/cloud-adventures/amd-ryzen.jpg"></preview>
<annotation>AMD Ryzen 5 8500G</annotation>
</align>

<br />
<br />

No particularly strong requirements here, except I wanted something less power hungry. Since we aren't running any compute intensive programs like encoding, I opted for the lower-end Ryzen 5 8500G, which was more than adequate.

<br />
<br />

# Memory

<br />

<align>
<preview src="src/posts/cloud-adventures/crucial-ram.jpg"></preview>
<annotation>Crucial RAM, 32GB Kit (2x16GB) DDR5 5600MHz</annotation>
</align>

<br />
<br />

Again, no hard requirements here. This RAM kit doubles the capacity of my previous setup. There is an interesting argument about using ECC RAM for ZFS setups (that a stuck bit in RAM during a scrub might murder your data), but since the motherboard of the DeskMini doesn't have support for it, it is something we had to forgo. Otherwise, more RAM is always appreciated!

<br />
<br />

# Bill of Cost

<br />

<preview sizes="preview" src="./src/posts/cloud-adventures/server-complete.jpg"></preview>

<br />
<br />

<row>
<card>
  <table>
    <tr><th>Components</th><th>Cost (in USD)</th></tr>
    <tr><td>2 × Lenovo 5210 ION</td><td>$440</td></tr>
    <tr><td>ASRock DeskMini X600</td><td>$190</td></tr>
    <tr><td>Phison SSD</td><td>$0</td></tr>
    <tr><td>AMD Ryzen 5 8500G</td><td>$160</td></tr>
    <tr><td>Crucial RAM</td><td>$95</td></tr>
    <tr><td colspan="2"><strong>Total Cost: $885</strong></td></tr>
  </table>
</card>
</row>
