#!/bin/sh
set -x
set -e

# create docker user (uid is same on host pc)
#adduser --disabled-password --shell /bin/bash -u 1001 user
adduser -D -s /bin/sh -u 1001 user
sed -i -r 's/^user:!:/user:x:/' /etc/shadow

chown -R user:user /var/run/
chown -R user:user /tmp

#
# Based on https://gist.github.com/kost/017e95aa24f454f77a37
#
# Docker build calls this script to harden the image during build.
#
# NOTE: To build on CircleCI, you must take care to keep the `find`
# command out of the /proc filesystem to avoid errors like:
#
#    find: /proc/tty/driver: Permission denied
#    lxc-start: The container failed to start.
#    lxc-start: Additional information can be obtained by \
#        setting the --logfile and --logpriority options.

# Improve strength of diffie-hellman-group-exchange-sha256 (Custom DH with SHA2).
# See https://stribika.github.io/2015/01/04/secure-secure-shell.html
#
# Columns in the moduli file are:
# Time Type Tests Tries Size Generator Modulus
#
# This file is provided by the openssh package on Fedora.
moduli=/etc/ssh/moduli
if [[ -f ${moduli} ]]; then
  cp ${moduli} ${moduli}.orig
  awk '$5 >= 2000' ${moduli}.orig > ${moduli}
  rm -f ${moduli}.orig
fi

# Remove existing crontabs, if any.
rm -fr /var/spool/cron
rm -fr /etc/crontabs
rm -fr /etc/periodic

# Remove all but a handful of admin commands.
find /sbin /usr/sbin ! -type d \
  -a ! -name login_duo \
  -a ! -name nologin \
  -a ! -name setup-proxy \
  -a ! -name sshd \
  -a ! -name start.sh \
  -delete

# Remove unnecessary user accounts.
sed -i -r '/^(user|root|sshd)/!d' /etc/group
sed -i -r '/^(user|root|sshd)/!d' /etc/passwd

# Remove interactive login shell for everybody but user.
sed -i -r '/^nginx:/! s#^(.*):[^:]*$#\1:/sbin/nologin#' /etc/passwd

sysdirs="
  /bin
  /etc
  /lib
  /sbin
  /usr
"

# Remove world-writable permissions.
# This breaks apps that need to write to /tmp,
# such as ssh-agent.
# Normally, I'd do this on the root fs, but circle ci fails with:
#   chmod: /dev/mqueue: Operation not permitted
# Therefore restrict the find to sysdirs listed above.
find $sysdirs -xdev -type d -perm +0002 -exec chmod o-w {} +
find $sysdirs -xdev -type f -perm +0002 -exec chmod o-w {} +

# Remove apk configs.
find $sysdirs -xdev -regex '.*apk.*' -exec rm -fr {} +

# Remove crufty...
#   /etc/shadow-
#   /etc/passwd-
#   /etc/group-
find $sysdirs -xdev -type f -regex '.*-$' -exec rm -f {} +

# Ensure system dirs are owned by root and not writable by anybody else.
find $sysdirs -xdev -type d \
  -exec chown root:root {} \; \
  -exec chmod 0755 {} \;

# Remove all suid files.
find $sysdirs -xdev -type f -a -perm +4000 -delete

# Remove other programs that could be dangerous.
find $sysdirs -xdev \( \
  -name hexdump -o \
  -name chgrp -o \
  -name chmod -o \
  -name chown -o \
  -name od -o \
  -name strings -o \
  -name su \
  \) -delete

# Remove init scripts since we do not use them.
rm -fr /etc/init.d
rm -fr /lib/rc
rm -fr /etc/conf.d
rm -fr /etc/inittab
rm -fr /etc/runlevels
rm -fr /etc/rc.conf

# Remove kernel tunables since we do not need them.
rm -fr /etc/sysctl*
rm -fr /etc/modprobe.d
rm -fr /etc/modules
rm -fr /etc/mdev.conf
rm -fr /etc/acpi

# Remove root homedir since we do not need it.
rm -fr /root

# Remove fstab since we do not need it.
rm -f /etc/fstab

# Remove broken symlinks (because we removed the targets above).
find $sysdirs -xdev -type l -exec test ! -e {} \; -delete
