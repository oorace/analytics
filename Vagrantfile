hostname = "analytics.dev"

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/xenial64"

  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.manage_guest = true
  config.hostmanager.ignore_private_ip = false
  config.hostmanager.include_offline = true

  config.vm.define "analytics" do |analytics|
    analytics.vm.hostname = "analytics"

    analytics.hostmanager.aliases = %W(#{hostname})

    # Docker port
    analytics.vm.network "forwarded_port", guest: 2375, host: 2375
    # SSH port
    analytics.vm.network "forwarded_port", guest: 22, host: 2210

    analytics.vm.network "private_network", ip: "10.10.10.99", auto_correct: true

    # Share your home directory to access your projects within the VM
    analytics.vm.synced_folder ENV['HOME'], "/garage"

    analytics.vm.provider "virtualbox" do |vb|
      # Customize the amount of memory on the VM:
      vb.memory = 2048
    end

    # Run a playbook to install python
    analytics.vm.provision "python", type: "ansible" do |ansible|
      set_environment(ansible, "development", hostname)
      ansible.playbook = "ansible/python.yml"
    end

    # Run a playbook to install boulder CA
    analytics.vm.provision "boulder", type: "ansible" do |ansible|
      set_environment(ansible, "development", hostname)
      ansible.playbook = "ansible/boulder.yml"
    end

    analytics.vm.provision "analytics", type: "ansible" do |ansible|
      set_environment(ansible, "development", hostname)
      ansible.playbook = "ansible/analytics.yml"

    end

  end

end

def set_environment(ansible, environment, hostname)
  ansible.host_vars = {
    "analytics" => {
      "analytics_domain_name" => hostname
    }
  }
  ansible.groups = {
    environment => [ "analytics" ]
  }
end
