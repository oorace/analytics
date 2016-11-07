Role Name
=========

Ansible Role to Install and Configure Logstash

[![Build Status](https://travis-ci.org/valentinogagliardi/logstash-role.svg?branch=master)](https://travis-ci.org/valentinogagliardi/logstash-role)

Requirements
------------

**Java** should be present on the nodes machines in order to run Logstash. This role does not install Java.

On Debian OS family, **python-pycurl** and **python-apt** are required to deal with apt Ansible modules. The role already take care of these dependencies.

Example Playbooks
----------------

```yaml
- hosts: LogstashNodes
  roles:
    - role: valentinogagliardi.logstash-role

      logstash_defaults: |
        LS_HEAP_SIZE="256m"
        LS_OPTS="-r --config.reload.interval 2"

      logstash_patterns: |
        TIMESTAMP_FOO %{MONTHDAY}-%{MONTH}-%{YEAR}-%{HOUR}:%{MINUTE}:%{SECOND}

      logstash_inputs: |
        syslog { host => "{{ ansible_eth0.ipv4.address }}"
                port => "514"
                type => "syslog_input"
              }

        syslog { host => "{{ ansible_lo.ipv4.address }}"
                port => "515"
                type => "syslog_input_local"
              }

        grok { patterns_dir => [ "./patterns" ]
              match => { "message" => "%{TIMESTAMP_FOO:[@metadata][timestamp]} %{GREEDYDATA:message}" }
            }

      logstash_filters: |
        geoip { source => "ip_address"
             }

        multiline { pattern => "^No lfn2pfn"
                   what => "previous"
                 }

      logstash_outputs: |
        file { path => "/var/log/logstash/output.log"
            }
```

Role Variables
--------------

```yaml
logstash_python_utils:
 - { package: "python-pycurl" }
 - { package: "python-apt" }

logstash_version: "none"

logstash_apt_repo: "deb http://packages.elasticsearch.org/logstash/{{ logstash_version }}/debian stable main"
logstash_repo_key: "http://packages.elasticsearch.org/GPG-KEY-elasticsearch"
logstash_yum_repo_dest: "/etc/yum.repos.d/logstash.repo"

logstash_home: "/usr/share/logstash"
logstash_settings: "/etc/logstash"

logstash_conf_dir: "/etc/logstash/conf.d/"
logstash_patterns_file: "/etc/logstash/patterns/extra"

logstash_defaults: "LS_HEAP_SIZE="512m""

defaults_RedHat: "/etc/sysconfig/logstash"
defaults_Debian: "/etc/default/logstash"
```

License
-------

GNU General Public License Version 2

Author Information
------------------

Valentino Gagliardi - valentino.g@servermanaged.it
