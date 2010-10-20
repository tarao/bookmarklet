#! /usr/bin/env ruby
$KCODE='UTF8'

require 'rubygems'
require 'json'
require 'cgi'
cgi = CGI.new

def is_local?(); return ENV['REMOTE_ADDR'] =~ /^(?:192\.168|127)\./ end

class IO
  def read_meta()
    meta = {}
    each_line do |line|
      if line =~ /^\s*\*\s*\@(\S+)\s+(.*)\s*$/
        name, value = [ $1, $2 ]
        if meta[name].is_a?(Array)
          meta[name] << value
        elsif meta[name]
          meta[name] = [value]
        else
          meta[name] = value
        end
      end
    end
    return !meta.empty? && meta
  end
end

cb = (cgi.params['callback'][0] || '').strip
cb = nil if cb.length == 0 && cb !~ /^\$?[a-zA-Z0-9\.\_\[\]]+$/

unless cb
  print("Content-Type: application/json; charset=utf-8\r\n\r\n")
else
  # JSONP
  print("Content-Type: text/javascript; charset=utf-8\r\n\r\n")
end

base = 'base.url'
base_default_url = 'http://github.com/tarao/bookmarklet/raw/master/js/'
catalog = {
  :base => (File.exist?(base) && IO.read(base).strip) || base_default_url,
  :list => {},
}

if is_local?
  base = 'base.debug.url'
  base_default_url = 'http://labs.orezdnu.org/let/js/'
  catalog[:debug] = {
    :base    => (File.exist?(base) && IO.read(base).strip) || base_default_url,
    :nocache => true,
  }
end

Dir.glob('js/*.js') do |file|
  open(file) do |io|
    meta = io.read_meta
    catalog[:list][File.basename(file)] = meta if meta
  end
end

json = catalog.to_json
json = "#{cb}(#{json});" if cb

puts(json)
